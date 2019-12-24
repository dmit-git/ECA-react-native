import gql from 'graphql-tag'

export const AGENDA = gql`
  query agenda($event_id: Uint) {
    agenda(event_id: $event_id) {
      id
      name
      location
      description
      start_time
      end_time
      recurring
      recurring_type
      updated_at
    }
  }
`

export const AGENDA_ITEM = gql`
  query agendaItem($id: Uint) {
    agendaItem(id: $id) {
      id
      name
      description
      location
      start_time
      end_time
      recurring
      recurring_type
    }
  }
`
