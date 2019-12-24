import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Content, Button, Form, Textarea, Icon, Text, Container } from 'native-base'
import Header from '../../../components/Header'
import analyticsStore from '../../../stores/analyticsStore'

export default class NewPost extends Component {
  state = {
    body: this.props.post.body
  }

  componentDidMount () {
    analyticsStore.sendScreenView('Edit Post')
  }

  submit = () => {
    const { body } = this.state
    this.props.onUpdatePost({ body })
  }

  handleSetState = (name) => (val) => {
    this.setState({ [name]: val })
  }

  render () {
    return (
      <Container>
        <Header
          headerTitle={'Edit Post'}
          renderLeft={(
            <Button transparent onPress={Actions.pop}>
              <Icon name='md-arrow-back' />
            </Button>
          )}
        />
        <Content>
          <View style={styles.container}>
            <Form>
              <Textarea
                rowSpan={7}
                value={this.state.body}
                onChangeText={this.handleSetState('body')}
                placeholder={`What's on your mind?`}
              />
            </Form>
          </View>
          <Button full primary onPress={this.submit}>
            <Text>Submit</Text>
          </Button>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {}
})
