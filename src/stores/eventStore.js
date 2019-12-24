import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-community/async-storage';
import { observable, action, computed } from 'mobx'
import { Actions } from 'react-native-router-flux'
import isEmpty from 'lodash/isEmpty'
import gql from 'graphql-tag'
import apolloClient from '../apolloClient'
import material from '../native-base-theme/variables/material'
import { makeUrgentQueries } from '../assetUtils'
import authStore from './authStore'

const EVENT = gql`
  query event($id: Uint) {
    event(id: $id) {
      id
      name
      homescreen_layout
      side_navigation
      theme
      start_time
      end_time
      pages {
        id
        name
        body
      }
      attendee_metadata {
        metadata
      }
    }
  }
`

const parseEvent = event => {
  return {
    ...event,
    side_navigation: JSON.parse(event.side_navigation.length ? event.side_navigation : '{"items": []}'),
    homescreen_layout: JSON.parse(event.homescreen_layout.length ? event.homescreen_layout : '{"rows": []}'),
    theme: { ...material, ...JSON.parse(event.theme)},
    attendee_metadata: {
      metadata: JSON.parse(event.attendee_metadata.metadata || '{}')
    }
  }
}

class EventStore {
  @observable loading = false
  @observable offline = false
  @observable event = {}
  @observable attendeeMetadata = {}

  constructor () {
    AsyncStorage.getItem('currentEventId', async (err, currentEventId) => {
      if (err) return console.log(err)
      if (!currentEventId) return
      const event = await this.fetchEvent(JSON.parse(currentEventId))
      if(event) Actions.reset('event', { id: event.id })
    })

    AsyncStorage.getItem('attendeeMetadata', (err, attendeeMetadata) => {
      if (err) return console.log(err)
      if (!attendeeMetadata) return
      this.attendeeMetadata = JSON.parse(attendeeMetadata)
    })
    NetInfo.getConnectionInfo().then(({ type }) => {
      this.offline = type === 'offline'
    })
    NetInfo.addEventListener(
      'connectionChange',
      this.handleConnectivityChange.bind(this)
    )
  }

  @computed get theme () {
    return this.event.theme || material
  }

  @computed get hasSetEvent () {
    return !isEmpty(this.event)
  }

  @action
  async fetchEvent (id) {
    const eventID = id || this.event.id
    console.log('Fetching :', eventID);

    if (!eventID) return false
    try {
      this.loading = true
      let event = this.event
      if (!this.offline) {
        const { data } = await apolloClient.query({
          fetchPolicy: 'network-only',
          query: EVENT,
          variables: { id: eventID }
        })
        event = parseEvent(data.event)
        if (event) {
          AsyncStorage.setItem('currentEventId', JSON.stringify(event.id))
          this.setEventAttendeeMetadata(event.attendee_metadata.metadata)
          makeUrgentQueries(event)
          authStore.sync(event.id)
          this.event = event
          this.loading = false
          return event
        }
      }
    } catch (e) {
      console.log('EventStore.fetchEvent error', e)
      return false
    }
  }

  @action
  async setEventAttendeeMetadata (metadata) {
    if (!metadata) return
    try {
      await AsyncStorage.setItem('attendeeMetadata', JSON.stringify(metadata || ''))
      this.attendeeMetadata = metadata
    } catch (e) {
      console.log('EventStore.setEventAttendeeMetadata error', e)
      alert('An error occured! If this problem continues, contact your administrator.')
    }
  }

  @action handleConnectivityChange ({ type }) {
    this.offline = type === 'offline'
    if (type !== 'offline' && this.event.id){
      this.fetchEvent()
    }
  }

  async clear () {
    this.event = {}
    this.attendeeMetadata = {}
    await AsyncStorage.removeItem('currentEventId')
  }
}

export default new EventStore()
