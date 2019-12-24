import React, { Component } from 'react'
import gql from 'graphql-tag'
import get from 'lodash/get'
import find from 'lodash/find'
import { Query } from 'react-apollo'
import analyticsStore from '../../stores/analyticsStore'
import NotificationsList from './NotificationsList';
import { _setNotificationUnRead } from '../../stores/NotificationStore';
import { RefreshControl, View, TouchableOpacity, Text } from 'react-native'
import { Content, } from 'native-base'
import { Actions } from 'react-native-router-flux'

const NOTIFICATIONS_PER_PAGE = 10

const MY_NOTIFICATIONS = gql`
  query myNotifications($offset: Uint) {
    myNotifications(offset: $offset) {
      nodes {
        id
        name
        body
        link
        time
      }
      page_info {
        total_count
        has_next_page
      }
    }
    me{
      id
      syncs {
        nodes {
          event_id
          unread_notifications
          last_notification_sync
        }
      }
    }
  }
`

export default class NotificationsContainer extends Component {


  state = {
    refreshingPull: false,
  }

  componentDidMount () {
    analyticsStore.sendScreenView('Notifications')
  }

  _onRefresh = () => {
    this.setState({ refreshingPull: true });
    setTimeout(() => {
      this.setState({ refreshingPull: false });
      Actions.push('notifications')
    }, 1500);
  }


  render() {
    const { page, handleNextPage, offline, eventID } = this.props
    return (
      <Query
        query={MY_NOTIFICATIONS}
        fetchPolicy={offline ? 'cache-only' : 'network-only'}
        variables={{ offset: page * NOTIFICATIONS_PER_PAGE }}>
        {({ loading, error, data, refetch, networkStatus }) => {
          if (loading) return null;
          const notifications = get(data, ['myNotifications', 'nodes']) || []
          const syncs = get(data, ['me', 'syncs', 'nodes']) || []
          const pageInfo = get(data, ['myNotifications', 'page_info']) || { has_next_page: false, total_count: 0 }
          const { unread_notifications } = find(syncs, { event_id: eventID }) || { unread_notifications: 999 }

          _setNotificationUnRead(unread_notifications.toString());



          return (

            <Content
              refreshControl={<RefreshControl refreshing={this.state.refreshingPull}
                onRefresh={() => this._onRefresh()} />
              }
            >


              <NotificationsList
                loading={loading}
                error={error}
                notifications={notifications}
                pageInfo={pageInfo}
                handleNextPage={handleNextPage}
                page={page}
                eventID={eventID}
                unreadNotifications={unread_notifications}

              />

            </Content>
          )
        }}
      </Query>
    )
  }
}
