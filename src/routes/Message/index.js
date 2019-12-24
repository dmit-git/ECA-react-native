import React, { Component } from 'react'
import { StyleProvider } from 'native-base'
import { inject, observer } from 'mobx-react'
import getTheme from '../../native-base-theme/components'
import material from '../../native-base-theme/variables/material'
import Message from './Message'
import Orientation from 'react-native-orientation';
@inject('eventStore', 'authStore', 'chatStore')
@observer
class MediaContainer extends Component {
  componentDidMount() {
    Orientation.lockToPortrait();
  }
  render () {
    const theme = getTheme(material(this.props.eventStore.theme))
    return (
      <StyleProvider style={theme}>
        <Message theme={theme} {...this.props} />
      </StyleProvider>
    )
  }
}

export default MediaContainer
