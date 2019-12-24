import React, { Component, Fragment } from 'react'
import { FlatList } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Container, Content, Icon, Button, Text, Card, CardItem, Body, Left, Form, Textarea, Thumbnail, ListItem } from 'native-base'
import moment from 'moment'
import Header from '../../../components/Header'
import PostCard from '../../../components/PostCard'
import analyticsStore from '../../../stores/analyticsStore'

export default class Post extends Component {
  state = {
    refreshing: false,
    body: ''
  }

  componentDidMount () {
    analyticsStore.sendScreenView('Post')
  }

  handleSetState = (name) => (val) => {
    this.setState({ [name]: val })
  }

  keyExtractor = (item, index) => String(item.id)

  handleMediaClick = (media = []) => () => {
    Actions.push('mediaViewer', { media })
  }

  submit = () => {
    const { body } = this.state
    this.props.onCreateComment({ body })
    this.setState({ body: '' })
  }

  renderComment = ({ item }) => {
    return (
      <ListItem avatar={!!item.attendee.avatar_url} key={item.id} last first>
        {
          item.attendee.avatar_url
            ? (
              <Left>
                <Thumbnail source={{uri: item.attendee.avatar_url}} />
              </Left>
            ) : <Fragment />
        }
        <Body>
          <Text>{`${item.attendee.first_name} ${item.attendee.last_name}`}{' ' + moment(item.created_at, moment.ISO_8601).fromNow()}</Text>
          <Text>{item.body}</Text>
        </Body>
      </ListItem>
    )
  }

  render () {
    const { post = {}, refetch } = this.props
    return (
      <Container>
        <Header
          headerTitle={post.name}
          renderLeft={(
            <Button transparent onPress={Actions.pop}>
              <Icon name='md-arrow-back' />
            </Button>
          )}
        />
        <Content>
          <PostCard post={post} handleMediaClick={this.handleMediaClick(post.media)} />
          <Card>
            { post.comments.nodes.length > 0 ? (
              <CardItem>
                <FlatList
                  keyExtractor={this.keyExtractor}
                  data={post.comments.nodes}
                  onRefresh={refetch}
                  refreshing={this.state.refreshing}
                  renderItem={this.renderComment}
                />
              </CardItem>
            ) : <Fragment />}
            <Form>
              <Textarea
                rowSpan={2}
                value={this.state.body}
                onChangeText={this.handleSetState('body')}
                placeholder={`Leave a comment`}
              />
              <Button full primary onPress={this.submit}>
                <Text>Comment</Text>
              </Button>
            </Form>
          </Card>
        </Content>
      </Container>
    )
  }
}
