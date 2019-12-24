import React, { Component } from 'react'
import { StyleProvider } from 'native-base'
import { inject, observer } from 'mobx-react'
import getTheme from '../../native-base-theme/components'
import MediaViewer from './MediaViewer'

@inject('eventStore')
@observer
class MediaViewerContainer extends Component {
  render () {
    return (
      <StyleProvider style={getTheme(this.props.eventStore.theme)}>
        <MediaViewer {...this.props} />
      </StyleProvider>
    )
  }
}

export default MediaViewerContainer
