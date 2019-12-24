import React, { Component } from 'react'
import { BackHandler, View } from 'react-native'
import { Container, Icon, Button } from 'native-base'
import { Actions } from 'react-native-router-flux'
import { GiftedChat, Send, Bubble } from 'react-native-gifted-chat'
import Loading from '../../components/Loading'
import Header from '../../components/Header'
import alert from '../../alert'

class Message extends Component {
  state = {
    isLoading: true,
    messages: []
  }

  componentDidMount () {
    this.props.chatStore.currentUser.subscribeToRoom({
      roomId: this.props.id,
      hooks: {
        onNewMessage: this.onReceive
      }
    })
    BackHandler.addEventListener('hardwareBackPress', Actions.messages)
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', Actions.messages)
  }

  onReceive = (data) => {
    const { id, senderId, text, createdAt } = data
    const incomingMessage = {
      _id: id,
      text: text,
      createdAt: new Date(createdAt),
      user: {
        _id: senderId,
        name: senderId,
        avatar: data.sender.avatarURL
      }
    }

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, incomingMessage)
    }))
  }

  onSend = ([message]) => {
    this.props.chatStore.currentUser.sendMessage({
      text: message.text,
      roomId: this.props.id
    })
  }

  renderSend = (props) => {
    const { variables: { brandPrimary } } = this.props.theme
    return (
      <Send {...props}>
        <View style={{marginRight: 10, marginBottom: 10}}>
          <Icon name='md-send' color={brandPrimary} />
        </View>
      </Send>
    )
  }

  renderBubble = (props) => {
    const { variables: { brandPrimary } } = this.props.theme
    return (
      <Bubble {...props} wrapperStyle={{
        right: {
          backgroundColor: brandPrimary
        }
      }} />
    )
  }

  render () {
    const { loading } = this.state
    const currentUser = this.props.chatStore.currentUser
    if (loading || !currentUser) return <Loading />
    return (
      <Container>
        <Header
          headerTitle='Chat'
          renderLeft={(
            <Button transparent onPress={Actions.pop}>
              <Icon name='md-arrow-back' />
            </Button>
          )}
        />
        <GiftedChat
          renderBubble={this.renderBubble}
          messages={this.state.messages}
          onSend={this.onSend}
          showUserAvatar
          renderSend={this.renderSend}
          user={{
            _id: this.props.authStore.profile.email
          }}
        />
      </Container>
    )
  }
}

export default Message
