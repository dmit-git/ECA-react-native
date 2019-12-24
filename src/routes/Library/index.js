import React, { Component } from 'react'
import { StyleProvider } from 'native-base'
import { Query } from 'react-apollo'
import { inject, observer } from 'mobx-react'
import getTheme from '../../native-base-theme/components'
import Library from './Library'
import { LIBRARY } from '../../queries/library'
import Orientation from 'react-native-orientation';
@inject('eventStore')
@observer
class LibraryContainer extends Component {
  componentDidMount() {
    Orientation.lockToPortrait();
  }
  render () {
    const { id } = this.props
    return (
      <Query
        query={LIBRARY}
        fetchPolicy={this.props.eventStore.offline ? 'cache-only' : 'cache-and-network'}
        variables={{ id }}>
        {({ loading, error, data, refetch }) => {
          if (loading) return null
          if (error) return null
          return (
            <StyleProvider style={getTheme(this.props.eventStore.theme)}>
              <Library iconColor={this.props.eventStore.theme.brandPrimary} library={data.library} refetch={refetch} />
            </StyleProvider>
          )
        }}
      </Query>
    )
  }
}

export default LibraryContainer
