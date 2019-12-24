import AsyncStorage from '@react-native-community/async-storage';
import { toIdValue } from 'apollo-utilities'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { HttpLink } from 'apollo-link-http'
import { persistCache } from 'apollo-cache-persist'
import { ApolloLink, Observable } from 'apollo-link'
import authStore from './stores/authStore'
import { GRAPHQL_ENDPOINT } from './config'
import alert from './alert'

const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      // const cache = new InMemoryCache()
      client: (_, args) => toIdValue(cache.config.dataIdFromObject({ __typename: 'Client', id: args.id })),
      agenda_item: (_, args) => toIdValue(cache.config.dataIdFromObject({ __typename: 'AgendaItem', id: args.id })),
      event: (_, args) => toIdValue(cache.config.dataIdFromObject({ __typename: 'Event', id: args.id })),
      group: (_, args) => toIdValue(cache.config.dataIdFromObject({ __typename: 'Group', id: args.id })),
      library: (_, args) => toIdValue(cache.config.dataIdFromObject({ __typename: 'Library', id: args.id })),
      media: (_, args) => toIdValue(cache.config.dataIdFromObject({ __typename: 'Media', id: args.id })),
      notification: (_, args) => toIdValue(cache.config.dataIdFromObject({ __typename: 'Notification', id: args.id })),
      page: (_, args) => toIdValue(cache.config.dataIdFromObject({ __typename: 'Page', id: args.id })),
      post: (_, args) => toIdValue(cache.config.dataIdFromObject({ __typename: 'Post', id: args.id })),
      tag: (_, args) => toIdValue(cache.config.dataIdFromObject({ __typename: 'Tag', id: args.id })),
      attendee: (_, args) => toIdValue(cache.config.dataIdFromObject({ __typename: 'Attendee', id: args.id })),
      attendee_metadata: (_, args) => toIdValue(cache.config.dataIdFromObject({ __typename: 'AttendeeMetadata', id: args.id }))
    }
  }
})

// Will restore from cache, and periodically back up to AsyncStorage for offline usage
persistCache({
  cache,
  storage: AsyncStorage
})

const request = async operation => {
  const token = await AsyncStorage.getItem('token')
  operation.setContext({
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const requestLink = new ApolloLink((operation, forward) =>
  new Observable(observer => {
    let handle
    Promise.resolve(operation)
      .then(oper => request(oper))
      .then(() => {
        handle = forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer)
        })
      })
      .catch(observer.error.bind(observer))

    return () => {
      if (handle) handle.unsubscribe()
    }
  })
)

export default new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors && graphQLErrors.length) alert(graphQLErrors)
      // if (networkError && networkError.message) alert(networkError.message)
      if (networkError && networkError.message) alert("Internet is not available.")
      if (networkError && networkError.statusCode === 401) authStore.logout()
    }),
    requestLink,
    new HttpLink({
      uri: GRAPHQL_ENDPOINT,
      credentials: 'include'
    })
  ]),
  cache
})
