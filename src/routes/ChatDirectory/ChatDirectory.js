import React, { Component } from 'react'
import last from 'lodash/last'
import { Actions } from 'react-native-router-flux'
import { FlatList } from 'react-native'
import { ListItem, Text, Icon, Body, Container, Button, CheckBox, Fab } from 'native-base'
import Header from '../../components/Header'
import analyticsStore from '../../stores/analyticsStore'
import alert from '../../alert'

export default class ChatDirectory extends Component {
  state = {
    refreshing: this.props.loading,
    attendees: this.props.attendees,
    userEmails: {},
    page: -1
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.attendees.length > 0 && nextProps.page > prevState.page) {
      const lastAttendee = last(prevState.attendees)
      if (lastAttendee && lastAttendee.id === last(nextProps.attendees).id) return { refreshing: nextProps.loading }
      return {
        page: nextProps.page,
        refreshing: nextProps.loading,
        attendees: prevState.attendees.concat(nextProps.attendees)
      }
    }
    return { refreshing: nextProps.loading }
  }

  componentDidMount () {
    analyticsStore.sendScreenView('Chat Directory')
  }

  handleCreateRoom = async () => {
    const currentEmail = this.props.authStore.profile.email
    const { userEmails } = this.state
    const name = [currentEmail, ...Object.keys(userEmails)].join(',')
    try {
      const room = await this.props.chatStore.currentUser.createRoom({
        name,
        private: false,
        addUserIds: Object.keys(userEmails)
      })
      Actions.push('message', { id: room.id })
    } catch (e) {
      console.log('ChatDirectory.handleCreateRoom error', e)
      alert('Something went wrong! If this problem persists, contact your administrator.')
    }
  }

  handleClick = (email) => () => {
    const { userEmails } = this.state
    userEmails[email] = !userEmails[email]
    this.setState({ userEmails: {...userEmails} })
  }

  keyExtractor = (item, index) => String(item.id)

  renderItem = ({ item }) => (
    <ListItem button onPress={this.handleClick(item.email)} last>
      <CheckBox checked={this.state.userEmails[item.email] === true} color='black' />
      <Body>
        <Text>{`${item.first_name} ${item.last_name}`}</Text>
        <Text note>{item.email}</Text>
      </Body>
    </ListItem>
  )

  handleNextPage = () => {
    if (this.state.attendees.length < this.props.pageInfo.total_count) this.props.handleNextPage()
  }

  render () {
    const { attendees, userEmails } = this.state
    const isValidChat = Object.values(userEmails).some(isAdded => isAdded)
    return (
      <Container>
        <Header
          headerTitle='Directory'
          renderLeft={(
            <Button transparent onPress={Actions.pop}>
              <Icon name='md-arrow-back' />
            </Button>
          )}
        />
        <FlatList
          keyExtractor={this.keyExtractor}
          data={attendees}
          initialNumToRender={10}
          onEndReached={this.handleNextPage}
          renderItem={this.renderItem}
          extraData={this.state.userEmails}
        />
        {
          isValidChat ? (
            <Fab
              style={{ backgroundColor: 'black' }}
              position='bottomRight'
              onPress={this.handleCreateRoom}>
              <Icon name='md-send' />
            </Fab>
          ) : null
        }
      </Container>
    )
  }
}
