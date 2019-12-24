import React, { Component } from 'react'
import { StyleProvider } from 'native-base'
import { Query } from 'react-apollo'
import { inject, observer } from 'mobx-react'
import getTheme from '../../native-base-theme/components'
import AgendaItem from './AgendaItem'
import { AGENDA_ITEM } from '../../queries/agenda'
import Orientation from 'react-native-orientation';
@inject('eventStore')
@observer
class AgendaItemContainer extends Component {
  componentDidMount() {
    Orientation.lockToPortrait();
  }
  render () {
    const { id } = this.props
    return (
      <Query
        query={AGENDA_ITEM}
        fetchPolicy={this.props.eventStore.offline ? 'cache-only' : 'cache-and-network'}
        variables={{ id }}>
        {({ loading, error, data, refetch }) => {
          if (loading) return null
          if (error) return null
          return (
            <StyleProvider style={getTheme(this.props.eventStore.theme)}>
              <AgendaItem agendaItem={data.agendaItem} />
            </StyleProvider>
          )
        }}
      </Query>
    )
  }
}

export default AgendaItemContainer
