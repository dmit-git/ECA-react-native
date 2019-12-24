import React, { PureComponent } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { Actions } from 'react-native-router-flux'
import AttendeeEvents from './AttendeeEvents'
import uniqBy from 'lodash/uniqBy'
import Loading from '../../components/Loading'

const LOGOUT = gql`
  mutation logout($pushToken: String!) {
    logout(pushToken: $pushToken ) {
     id
    }
  }
`;

const ATTENDEE_EVENTS = gql`
  query me {
    me{
      id
      email
      events {
        id
        name
        status
        start_time
        end_time
        event_image
        event_image_url
        location
        theme
        analytics_id
        attendee_metadata {
          metadata
        }
      }
      push_token
      last_sync
    }
  }
`

export default class AttendeeEventsContainer extends PureComponent {
  static onEnter = (props) => {
    Actions.refresh(props)
  }

  render () {
    return (
      <Query query={ATTENDEE_EVENTS} fetchPolicy='cache-and-network'>
        {({ loading, error, data, refetch }) => {
          if (loading) return <Loading />
          if (error) return null
          const events = uniqBy(data.me.events, 'id')
            .filter(event => event.status === 'ACTIVE')
          return (
            <AttendeeEvents
              events={events}
              refetch={refetch}
              LOGOUT={LOGOUT}
            />
          )
        }}
      </Query>
    )
  }
}
