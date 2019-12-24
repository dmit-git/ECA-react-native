import React, { Component } from 'react'
import { StyleProvider } from 'native-base'
import { inject, observer } from 'mobx-react'
import getTheme from '../../native-base-theme/components'
import Messages from './Messages'
import Orientation from 'react-native-orientation';
@inject('authStore', 'eventStore', 'chatStore')
@observer
class MessagesContainer extends Component {

  componentDidMount() {
    Orientation.lockToPortrait();
  }
  render () {
    const email = this.props.authStore.profile.email
    return (
      <StyleProvider style={getTheme(this.props.eventStore.theme)}>
        <Messages email={email} chatStore={this.props.chatStore} />
      </StyleProvider>
    )
  }
}

export default MessagesContainer
