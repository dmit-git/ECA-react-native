import React, { Component } from 'react'
import { Actions } from 'react-native-router-flux'
import { FlatList } from 'react-native'
import { Content, ListItem, Text, Left, Icon, Body, Container, Button } from 'native-base'
import Header from '../../components/Header'
import analyticsStore from '../../stores/analyticsStore'

const getMediaIcon = (mimeType) => {
  const type = mimeType.split('/')[0]
  if (type === 'image') return 'image'
  if (type === 'application') return 'document'
  if (type === 'video') return 'videocam'
}

export default class Library extends Component {
  state = {
    refreshing: false
  }

  componentDidMount () {
    analyticsStore.sendScreenView(`Library - ${this.props.library.name}`)
  }

  handleClick = (media) => () => {
    analyticsStore.sendScreenView(`Media - ${media.name}`)
    Actions.push('mediaStack', { id: media.id })
  }

  keyExtractor = (item, index) => String(item.id)

  renderItem = ({ item }) => (
    <ListItem avatar button onPress={this.handleClick(item)} last>
      <Left>
        <Icon name={getMediaIcon(item.mime_type)} style={{ color: this.props.iconColor, fontSize: 22 }} />
      </Left>
      <Body>
        <Text>{decodeURIComponent(item.name)}</Text>
      </Body>
    </ListItem>
  )

  render () {
    const { library, refetch } = this.props
    return (
      <Container>
        <Header
          headerTitle={library.name}
          renderLeft={(
            <Button transparent onPress={Actions.pop}>
              <Icon name='md-arrow-back' />
            </Button>
          )}
        />
        <Content>
          <FlatList
            keyExtractor={this.keyExtractor}
            data={library.media.nodes}
            onRefresh={refetch}
            refreshing={this.state.refreshing}
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
