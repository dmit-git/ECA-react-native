import React, { Component } from 'react'
import { Actions } from 'react-native-router-flux'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { inject, observer } from 'mobx-react'
import { StyleProvider } from 'native-base'
import { POSTS } from '../../../queries/post'
import getTheme from '../../../native-base-theme/components'
import NewPost from './NewPost'
import Orientation from 'react-native-orientation';
let Constants = require('../../../../app.json')

const { CLIENT_ID } = Constants.expo.extra

export const CREATE_POST = gql`
  mutation createPost($post: PostInput!) {
    createPost(post: $post) {
        id
        attendee {
          id
          email
          first_name
          last_name
          avatar_url
        }
        body
        likes
        created_at
        comments {
          nodes {
            id
          }
        }
        attendees_who_liked {
          nodes {
            id
          }
          page_info {
            total_count
          }
        }
        media {
          nodes {
            id
            name
            src
            mime_type
          }
        }
      }
  }
`

@inject('eventStore', 'authStore', 'analyticsStore')
@observer
class NewPostContainer extends Component {

  componentDidMount() {
    Orientation.lockToPortrait();
  }

  onUpdate = (cache, { data: { createPost } }) => {
    this.props.analyticsStore.sendEvent({ category: 'New Post', action: 'create' })
    Actions.reset('feed', { forceRefetch: true, newPost: createPost })
  }

  onCreate = (createPost) => (post) => {
    const id = this.props.eventStore.event.id
    const attendeeID = this.props.authStore.profile.id
    createPost({
      variables: {
        post: {
          ...post,
          attendee_id: attendeeID,
          event_id: id,
          client_id: CLIENT_ID
        }
      }
    })
  }

  render () {
    return (
      <Mutation mutation={CREATE_POST} update={this.onUpdate} refetchQueries={[
        { query: POSTS,
          variables: {
            event_id: this.props.eventStore.event.id,
            offset: 0,
            search_query:''
          }
        }
      ]}>
        {(createPost) => (
          <StyleProvider style={getTheme(this.props.eventStore.theme)}>
            <NewPost
              {...this.props}
              onCreate={this.onCreate(createPost)}
            />
          </StyleProvider>
        )}
      </Mutation>
    )
  }
}

export default NewPostContainer
