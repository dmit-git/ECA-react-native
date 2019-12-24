import React, { Component } from 'react'
import { StyleProvider } from 'native-base'
import { Actions } from 'react-native-router-flux'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { inject, observer } from 'mobx-react'
import getTheme from '../../native-base-theme/components'
import AttendeeDetail from './AttendeeDetail'
import Orientation from 'react-native-orientation';

const ATTENDEE = gql`
  query attendee($id: Uint) {
    attendee(id: $id) {
      id
      email
      first_name
      last_name
      company
      title
      bio
      team
      district
      region
      area
      address
      city
      county
      country
      state
      postal_code
      avatar_url
      mobile_number
      phone_number
      facebook_url
      linkedin_url
      website_url
      twitter_url
      blog_url
      has_chat_user
    }
  }
`

@inject('eventStore', 'authStore')
@observer
class AttendeeDetailContainer extends Component {
  componentDidMount() {
    Orientation.lockToPortrait();
  }
  handleCreateRoom = (email) => async () => {
    const currentEmail = this.props.authStore.profile.email
    const name = [currentEmail, email].join(',')
    try {
      const room = await this.props.chatStore.currentUser.createRoom({
        name,
        private: false,
        addUserIds: [email]
      })
      Actions.push('message', { id: room.id })
    } catch (e) {
      console.log('handleCreateRoom error error', e)
      alert('Something went wrong! If this problem persists, contact your administrator.')
    }
  }

  render () {
    const id = this.props.id || this.props.authStore.profile.id;
    const currentEmail = this.props.authStore.profile.email
    return (
      <Query
        query={ATTENDEE}
        fetchPolicy={this.props.eventStore.offline ? 'cache-only' : 'cache-and-network'}
        variables={{ id }}>
        {({ loading, error, data, refetch }) => {
          if (loading) return null
          if (error) return null
          return (
            <StyleProvider style={getTheme(this.props.eventStore.theme)}>
              <AttendeeDetail
                isMe={currentEmail === data.attendee.email}
                attendee={data.attendee}
                handleCreateRoom={this.handleCreateRoom}
              />
            </StyleProvider>
          )
        }}
      </Query>
    )
  }
}

export default AttendeeDetailContainer
