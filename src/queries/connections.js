import gql from 'graphql-tag'

export const CONNECTIONS = gql`
  query connections($client_id: Uint!, $event_id: Uint!, $attendee_id: Uint!) {
    connections(client_id: $client_id, event_id: $event_id, attendee_id: $attendee_id) {
      nodes {
        id
        event_id
        attendees {
          nodes {
            id
            email
            first_name
            last_name
            avatar_url
          }
        }
        created_at
        updated_at
      }
    }
  }
`

