import React, { Component } from 'react'
import { StyleProvider } from 'native-base'
import gql from 'graphql-tag'
import { inject, observer } from 'mobx-react'
import { Query } from 'react-apollo'
import getTheme from '../../native-base-theme/components'
import Media from './Media'
import { manifest } from '../../assetCache'

const MEDIA = gql`
  query media($id: Uint) {
    media(id: $id) {
      id
      name
      src
      type
      mime_type
    }
  }
`

@inject('eventStore')
@observer
class MediaContainer extends Component {
  render () {
    const localMedia = manifest[String(this.props.id)]
    if (localMedia) {
      return (
        <StyleProvider style={getTheme(this.props.eventStore.theme)}>
          <Media media={localMedia} local />
        </StyleProvider>
      )
    }
    return (
      <Query
        query={MEDIA}
        fetchPolicy={this.props.eventStore.offline ? 'cache-only' : 'cache-and-network'}
        variables={{ id: this.props.id }}>
        {({ loading, error, data, refetch }) => {
          if (loading) return null
          if (error) return null
          return (
            <StyleProvider style={getTheme(this.props.eventStore.theme)}>
              <Media media={data.media} navigation={this.props.navigation} />
            </StyleProvider>
          )
        }}
      </Query>
    )
  }
}

export default MediaContainer
