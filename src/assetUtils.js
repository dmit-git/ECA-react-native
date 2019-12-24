import isObject from 'lodash/isObject'
import { sources } from './assetCache'
import apolloClient from './apolloClient'

import { AGENDA, AGENDA_ITEM } from './queries/agenda'
import { LIBRARY } from './queries/library'
import { PAGE } from './queries/page'

export const assetFromID = (id) => {
  return null  // because no local asset in react native
}

const linkToQuery = {
  'agendaItemStack': AGENDA_ITEM,
  'libraryStack': LIBRARY,
  'pageStack': PAGE
}

export const makeUrgentQueries = (event) => {
  // Get and cache the agenda
  apolloClient.query({
    fetchPolicy: 'network-only',
    query: AGENDA,
    variables: { event_id: event.id }
  })
  // Cache libraries
  event.side_navigation.items.forEach(item => {
    if (!linkToQuery[item.type]) return
    try {
      apolloClient.query({
        fetchPolicy: 'network-only',
        query: linkToQuery[item.type],
        variables: { id: +item.id }
      })
    } catch (e) {
      console.log(e)
    }
  })

  const uriArray = []
  event.homescreen_layout.rows.forEach(({ children }) => {
    children.forEach(({ component, props }) => {
      if (component === 'Image') {
        uriArray.push(props.source.uri)
      }
      if (props.onPress) {
        let link = props.onPress
        if (isObject(props.onPress)) link = props.onPress.link
        if (link === '/') {
          const [_, type, id] = link.split('/')
          if (!linkToQuery[type]) return
          try {
            apolloClient.query({
              fetchPolicy: 'network-only',
              query: linkToQuery[type],
              variables: { id }
            })
          } catch (e) {
            console.log(e)
          }
        }
      }
    })
  })
}
