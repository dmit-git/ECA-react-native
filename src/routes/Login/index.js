import React, { Component } from 'react'
import { Actions } from 'react-native-router-flux'
import gql from 'graphql-tag'
import { inject, observer } from 'mobx-react'
import { Mutation } from 'react-apollo'
import Login from './Login'
import alert from '../../alert'
import {SERVER_CLIENT_ID  } from '../../config'
import Orientation from 'react-native-orientation';

//,client: "${SERVER_CLIENT_ID}"
const LOGIN = gql`
  mutation login($email: String!, $password: String!,) {
    login(email: $email, password: $password,client: "${SERVER_CLIENT_ID}" ) {
      id
      email
      token
      push_token
      sso_id
      first_name
      last_name
      password
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
      mobile_number
      phone_number
      facebook_url
      linkedin_url
      website_url
      twitter_url
      blog_url
      is_manager
      client_metadata
      events {
        id
        name
      }
      groups {
        id
        name
      }
      syncs {
        nodes {
          event_id
          unread_notifications
          last_notification_sync
        }
      }
      last_sync
      created_at
      updated_at
      deleted_at
    }
  }
`

@inject('authStore') @observer
class LoginContainer extends Component {
  
  componentDidMount() {
    Orientation.lockToPortrait();
  }

  onUpdate = async (cache, { data: { login }, error }) => {
    if (!error) {
      const attendee = await this.props.authStore.setSession(login)
      if (attendee) Actions.replace('attendeeEvents')
    }
  }

  handleSubmit = (login) => (variables) => {
    // return login({ variables })
    return this.props.authStore.login(login, variables)
  }

  handleError = () => {
    alert('Failed to login. Please try again, or contact your event administrator if this error persists.')
  }

  render () {
    return (
      <Mutation mutation={LOGIN} update={this.onUpdate} onError={this.handleError}>
        {(login) => (
          <Login
            {...this.props}
            handleSubmit={this.handleSubmit(login)}
          />
        )}
      </Mutation>
    )
  }
}

export default LoginContainer
