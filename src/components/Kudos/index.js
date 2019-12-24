import React from 'react'
import { Query } from 'react-apollo'
import { inject, observer } from 'mobx-react'
import { ATTENDEEKUDOSLIST } from '../../queries/kudo'
import KudoList from './KudoList'

export default inject('eventStore', 'authStore')(observer((props) => {
  return (
    <Query
      query={ATTENDEEKUDOSLIST}
      // fetchPolicy={props.eventStore.offline ? 'cache-only' : 'cache-and-network'}
      fetchPolicy='cache-and-network' //{props.eventStore.offline ? 'cache-only' : 'cache-and-network'}
      variables={{
          event_id: props.eventStore.event.id,
          attendee_id: props.attendee.id
      }}>
      {({ loading, error, data, refetch }) => {
        if (loading) return null
        if (error) return null
        return <KudoList {...props} kudos={data.attendeeKudosList.kudos} badges={data.attendeeKudosList.badges} />
      }}
    </Query>
  )
}))
