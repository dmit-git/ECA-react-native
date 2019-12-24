import React, { PureComponent } from 'react'
import { Actions } from 'react-native-router-flux'
import { FlatList } from 'react-native'
import { Content, ListItem, Text, Left, Icon, Body, Container, Button, Thumbnail } from 'native-base'
import Header from '../../components/Header'
import analyticsStore from '../../stores/analyticsStore'

export default class PostLikes extends PureComponent {
  componentDidMount () {
    analyticsStore.sendScreenView(`PostLikes - ${this.props.post.id}`)
  }

  keyExtractor = (item, index) => String(item.id)

  handleClickAttendee = (id) => () => {
    Actions.push('attendeeDetail', { id })
  }

  renderItem = ({ item }) => (
    <ListItem button onPress={this.handleClickAttendee(item.id)} thumbnail last>
      <Left>
        {item.avatar_url ? (
          <Thumbnail square source={{ uri: item.avatar_url }} />
        ) : (
          <Icon name='md-contact' />
        )}
      </Left>
      <Body>
        <Text>{`${item.first_name} ${item.last_name}`}</Text>
        <Text note>{item.email}</Text>
      </Body>
    </ListItem>
  )
  render () {
    const { post, refetch } = this.props
    return (
      <Container>
        <Header
          headerTitle='Likes'
          renderLeft={(
            <Button transparent onPress={Actions.pop}>
              <Icon name='md-close' />
            </Button>
          )}
        />
        <Content>
          <FlatList
            keyExtractor={this.keyExtractor}
            data={post.attendees_who_liked.nodes}
            renderItem={this.renderItem}
            ListEmptyComponent={(
              <Text>Nothing to see here!</Text>
            )}
          />
        </Content>
      </Container>
    )
  }
}
