import React, { Component } from 'react'
import { StyleProvider } from 'native-base'
import { Actions } from 'react-native-router-flux'
import gql from 'graphql-tag'
import { inject, observer } from 'mobx-react'
import { Query, Mutation } from 'react-apollo'
import getTheme from '../../../native-base-theme/components'
import material from '../../../native-base-theme/variables/material'
import EditPost from './EditPost'
import { POST } from '../../../queries/post'
import Orientation from 'react-native-orientation';
let Constants = require('../../../../app.json')

const { CLIENT_ID } = Constants.expo.extra

const UPDATE_POST = gql`
  mutation updatePost($post: PostInput!) {
    updatePost(post: $post) {
      id
      attendee {
        id
        email
        first_name
        last_name
        avatar_url
      }
      body
    }
  }
`

@inject('eventStore', 'authStore', 'analyticsStore')
@observer
class PostContainer extends Component {
  componentDidMount() {
    Orientation.lockToPortrait();
  }
  onUpdate = (cache, { data: { updatePost } }) => {
    this.props.analyticsStore.sendEvent({ category: 'Post', action: 'edit' })
    Actions.reset('feed', { forceRefetch: true })
  }

  onUpdatePost = (updatePost) => (post) => {
    const { id } = this.props
    const attendeeID = this.props.authStore.profile.id
    updatePost({
      refetchQueries: [
        'posts'
      ],
      variables: {
        post: {
          ...post,
          id,
          parent_id: id,
          attendee_id: attendeeID,
          client_id: CLIENT_ID
        }
      }
    })
  }

  render () {
    const { id } = this.props
    return (
      <Mutation mutation={UPDATE_POST} update={this.onUpdate}>
        {(updatePost) => (
          <Query
            query={POST}
            fetchPolicy={this.props.eventStore.offline ? 'cache-only' : 'cache-and-network'}
            variables={{ id }}>
            {({ loading, error, data, refetch }) => {
              if (loading) return null
              if (error) return null
              return (
                <StyleProvider style={getTheme(this.props.eventStore.theme)}>
                  <EditPost post={data.post} refetch={refetch} onUpdatePost={this.onUpdatePost(updatePost)} />
                </StyleProvider>
              )
            }}
          </Query>
        )}
      </Mutation>
    )
  }
}

export default PostContainer
