import React, { Component } from 'react'
import { StyleProvider } from 'native-base'
import { Query } from 'react-apollo'
import { inject, observer } from 'mobx-react'
import getTheme from '../../native-base-theme/components'
import PostLikes from './PostLikes'
import { POST_LIKES } from '../../queries/post'
import Orientation from 'react-native-orientation';

@inject('eventStore')
@observer
class PostLikesContainer extends Component {
  componentDidMount() {
    Orientation.lockToPortrait();
  }
  render () {
    const { id } = this.props
    return (
      <Query
        query={POST_LIKES}
        fetchPolicy={this.props.eventStore.offline ? 'cache-only' : 'cache-and-network'}
        variables={{ id }}>
        {({ loading, error, data, refetch }) => {
          if (loading) return null
          if (error) return null
          return (
            <StyleProvider style={getTheme(this.props.eventStore.theme)}>
              <PostLikes iconColor={this.props.eventStore.theme.brandPrimary} post={data.post} refetch={refetch} />
            </StyleProvider>
          )
        }}
      </Query>
    )
  }
}

export default PostLikesContainer
