import React, { Component } from 'react'
import { Actions } from 'react-native-router-flux'
import { FlatList, View, StyleSheet } from 'react-native'
import { Container, Button, Icon, Content, ListItem, Text, Left, Right, Thumbnail, Body } from 'native-base'
import Header from '../../components/Header'

export default class Messages extends Component {
  handlePress = (id) => () => {
    Actions.push('message', { id })
  }

  // handleScroll = (e) => {
  //   if (e.nativeEvent.contentOffset.y < -100 && !this.props.isLoading && !this.state.groupChannelListQuery.isLoading) {
  //     this.initGroupChannelList()
  //   }
  // }

  keyExtractor = (item, index) => String(item.id)

  // onEndReached = () => this.getGroupChannelList(false)

  renderItem = ({ item }) => {
    const { email } = this.props
    const ids = item.name.split(',').filter(addr => addr !== email)
    let name = ids.join(',')
    if (name.length > 60) name = name.slice(0, 56) + '...'
    return (
      <ListItem icon button onPress={this.handlePress(item.id)}>
        <Left>
          <Icon active name={ids.length > 1 ? 'md-contacts' : 'md-contact'} />
        </Left>
        <Body>
          <Text>{name}</Text>
        </Body>
      </ListItem>
    )
  }

  render () {
    return (
      <Container>
        <Header
          headerTitle={'Messages'}
          renderLeft={(
            <Button transparent onPress={Actions.drawerOpen}>
              <Icon name='md-menu' />
            </Button>
          )}
          renderRight={(
            <Button transparent onPress={Actions.chatDirectory}>
              <Icon name='md-add' />
            </Button>
          )}
        />
        <Content>
          <View style={styles.container}>
            <FlatList
              renderItem={this.renderItem}
              data={this.props.chatStore.currentUser.rooms}
              extraData={this.state}
              keyExtractor={this.keyExtractor}
              // onEndReached={this.onEndReached}
              onEndReachedThreshold={0}
              // onScroll={this.handleScroll}
              ListEmptyComponent={(
                <Text>No messages! Check back later.</Text>
              )}
            />
          </View>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  }
})
