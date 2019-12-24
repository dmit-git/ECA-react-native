import gql from 'graphql-tag'

export const ATTENDEEKUDOSLIST = gql`
query attendeeKudosList($event_id: Uint!, $attendee_id: Uint!) {
  attendeeKudosList(event_id: $event_id, attendee_id: $attendee_id) {
    kudos{
      id
      src
      type
      kudo_givens{
        attendee_giver_id
      }
    }
    badges{
      id
      src
      type
    }
  }
}
`
