import React from 'react'
import { Actions } from 'react-router-native-flux'
import { Content, Text, Container, Button, Icon } from 'native-base'
import Header from '../../components/Header'

export default ({ attendee }) => (
  <Container>
    <Header
      headerTitle={'My Account'}
      renderLeft={(
        <Button transparent onPress={Actions.drawerOpen}>
          <Icon name='md-menu' />
        </Button>
      )}
    />
    <Content>
      <Text>Account</Text>
    </Content>
  </Container>
)
