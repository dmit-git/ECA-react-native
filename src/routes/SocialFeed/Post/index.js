import React, { Component } from 'react'
import { StyleProvider } from 'native-base'
import gql from 'graphql-tag'
import { inject, observer } from 'mobx-react'
import { Query, Mutation } from 'react-apollo'
import getTheme from '../../../native-base-theme/components'
import Post from './Post'
import { POST } from '../../../queries/post'
import Orientation from 'react-native-orientation';
let Constants = require('../../../../app.json')

const { CLIENT_ID } = Constants.expo.extra

const CREATE_COMMENT = gql`
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
    }
  }
`

@inject('eventStore', 'analyticsStore', 'authStore')
@observer
class PostContainer extends Component {
  componentDidMount() {
    Orientation.lockToPortrait();
  }
  onUpdate = (cache, { data: { createPost } }) => {
    this.props.analyticsStore.sendEvent({ category: 'Comment', action: 'create' })
    const { id } = this.props
    const { post } = cache.readQuery({
      query: POST,
      variables: { id }
    })
    cache.writeQuery({
      query: POST,
      variables: { id },
      data: { post: { ...post, comments: { ...post.comments, nodes: post.comments.nodes.concat(createPost) } } }
    })
  }

  onCreateComment = (createComment) => (post) => {
    const { id } = this.props
    const attendeeID = this.props.authStore.profile.id
    createComment({
      variables: {
        post: {
          ...post,
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
      <Mutation mutation={CREATE_COMMENT} update={this.onUpdate}>
        {(createComment) => (
          <Query
            query={POST}
            fetchPolicy='cache-and-network'
            variables={{ id }}>
            {({ loading, error, data = {}, refetch }) => {
              if (loading) return null
              if (error) return null
              return (
                <StyleProvider style={getTheme(this.props.eventStore.theme)}>
                  <Post post={data.post} refetch={refetch} onCreateComment={this.onCreateComment(createComment)} />
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
