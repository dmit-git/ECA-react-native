import React, { Component } from 'react'
import debounce from 'lodash/debounce'
import noop from 'lodash/noop'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { Actions } from 'react-native-router-flux'
import { Button, Icon, Text } from 'native-base'
import analyticsStore from '../../stores/analyticsStore'

const LIKE_POST = gql`
  mutation likePost($post_id: Uint!, $attendee_id: Uint!, $increment: Uint!) {
    likePost(post_id: $post_id, attendee_id: $attendee_id, increment: $increment) {
      id
      likes
    }
  }
`

export default class LikeButton extends Component {
  state = {
    liked: this.props.liked,
    likes: this.props.likes
  }

  handleLike = (likePost) => debounce(() => {
    const { myID } = this.props
    this.setState({
      liked: !this.state.liked,
      likes: this.state.liked ? this.state.likes - 1 : this.state.likes + 1
    })
    if (!this.state.liked) {
      analyticsStore.sendEvent({ category: 'Post', action: 'unlike' })
    } else {
      analyticsStore.sendEvent({ category: 'Post', action: 'like' })
    }
    likePost({
      variables: {
        post_id: this.props.id,
        attendee_id: myID,
        increment: this.state.liked ? 1 : -1
      }
    })
  }, 300)

  handleShowLikes = () => {
    Actions.push('postLikes', { id: this.props.id })
  }

  render () {
    const { isMine } = this.props
    const { liked, likes } = this.state
    return (
      <Mutation mutation={LIKE_POST}>
        {(likePost) => (
          <Button
            bordered
            block
            onPress={isMine ? noop : this.handleLike(likePost)}
            onLongPress={this.handleShowLikes}
            primary={liked}
          >
            <Icon name='md-thumbs-up' />
            <Text>{likes}</Text>
          </Button>
        )}
      </Mutation>

    )
  }
}
