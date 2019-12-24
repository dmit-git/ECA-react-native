import React, { Component } from 'react'
import { StyleProvider } from 'native-base'
import { Query } from 'react-apollo'
import { inject, observer } from 'mobx-react'
import getTheme from '../../native-base-theme/components'
import Page from './Page'
import { PAGE, parsePage } from '../../queries/page'
import Orientation from 'react-native-orientation';
@inject('eventStore', 'authStore')
@observer
class PageContainer extends Component {
  componentDidMount() {
    Orientation.lockToPortrait();
  }
  render () {
    const { id } = this.props
    const groupIDs = this.props.authStore.groupIDs
    return (
      <Query
        query={PAGE}
        fetchPolicy={this.props.eventStore.offline ? 'cache-only' : 'cache-and-network'}
        variables={{ id }}>
        {({ loading, error, data, refetch }) => {
          if (loading) return null
          if (error) return null
          return (
            <StyleProvider style={getTheme(this.props.eventStore.theme)}>
              <Page page={parsePage(data.page)} groupIDs={groupIDs} />
            </StyleProvider>
          )
        }}
      </Query>
    )
  }
}

export default PageContainer
