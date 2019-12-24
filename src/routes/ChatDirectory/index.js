import React, { Component } from 'react'
import { StyleProvider } from 'native-base'
import gql from 'graphql-tag'
import get from 'lodash/uniqBy'
import { Query } from 'react-apollo'
import { inject, observer } from 'mobx-react'
import ChatDirectory from './ChatDirectory'
import getTheme from '../../native-base-theme/components'
import throttle from 'lodash/throttle'
import Orientation from 'react-native-orientation';
const ATTENDEES_PER_PAGE = 10

const EVENT_ATTENDEES = gql`
  query eventAttendees($event_id: Uint, $offset: Uint) {
    eventAttendees(event_id: $event_id, offset: $offset) {
      nodes {
        id
        email
        avatar_url
        first_name
        last_name
        has_chat_user
      }
      page_info { 
        has_next_page
        total_count
      }
    }
  }
`

@inject('eventStore', 'chatStore', 'authStore')
@observer
class ChatDirectoryContainer extends Component {
  state = {
    page: 0
  }
  componentDidMount() {
    Orientation.lockToPortrait();
  }

  handleNextPage = throttle(() => {
    this.setState({ page: this.state.page + 1 })
  }, 500, { leading: true })

  render () {
    const { page } = this.state
    const eventID = this.props.eventStore.event.id
    return (
      <StyleProvider style={getTheme(this.props.eventStore.theme)}>
        <Query
          query={EVENT_ATTENDEES}
          fetchPolicy={this.props.eventStore.offline ? 'cache-only' : 'cache-and-network'}
          variables={{ event_id: eventID, offset: page * ATTENDEES_PER_PAGE }}>
          {({ loading, error, data, refetch }) => {
            const attendees = get(data, ['eventAttendees', 'nodes']) || []
            const pageInfo = get(data, ['eventAttendees', 'page_info']) || { has_next_page: false, total_count: 0 }
            return (
              <ChatDirectory
                attendees={attendees}
                page={page}
                handleNextPage={this.handleNextPage}
                pageInfo={pageInfo}
              />
            )
          }}
        </Query>
      </StyleProvider>
    )
  }
}

export default ChatDirectoryContainer
