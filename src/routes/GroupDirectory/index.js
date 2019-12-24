import React, { Component } from 'react'
import { StyleProvider, Container, Button, Icon } from 'native-base'
import { inject, observer } from 'mobx-react'
import { Actions } from 'react-native-router-flux'
import getTheme from '../../native-base-theme/components'
import Header from '../../components/Header'
import GroupDirectoryQuery from './GroupDirectoryQuery'

@inject('eventStore')
@observer
class GroupDirectoryContainer extends Component {
  render () {
    const { id, headerTitle } = this.props
    return (
      <StyleProvider style={getTheme(this.props.eventStore.theme)}>
        <Container>
          <Header
            headerTitle={headerTitle}
            renderLeft={(
              <Button transparent onPress={Actions.pop}>
                <Icon name='md-arrow-back' />
              </Button>
            )}
          />
          <GroupDirectoryQuery id={id} />
        </Container>
      </StyleProvider>
    )
  }
}

export default GroupDirectoryContainer
