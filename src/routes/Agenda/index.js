import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { View } from 'react-native'
import { inject, observer } from 'mobx-react'
import { StyleProvider } from 'native-base'
import { AGENDA } from '../../queries/agenda'
import getTheme from '../../native-base-theme/components'
import Agenda from './Agenda'
import Orientation from 'react-native-orientation';

@inject('eventStore', 'authStore', 'analyticsStore')
@observer
class AgendaQuery extends Component {
  componentDidMount () {
    Orientation.lockToPortrait();
    this.props.analyticsStore.sendScreenView('Agenda')
  }

  render () {
    const event = this.props.eventStore.event
    return (
      <Query
        query={AGENDA}
        fetchPolicy={this.props.eventStore.offline ? 'cache-only' : 'cache-and-network'}
        variables={{ event_id: event.id }}>
        {({ loading, error, data, refetch }) => {
          if (loading) return <View />
          if (error) return <View />
          const eventTheme = getTheme(this.props.eventStore.theme)
          return (
            <StyleProvider style={eventTheme}>
              <Agenda agenda={data.agenda} event={event} theme={eventTheme} />
            </StyleProvider>
          )
        }}
      </Query>
    )
  }
}

export default AgendaQuery
