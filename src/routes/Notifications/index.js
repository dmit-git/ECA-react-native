import React, { Component } from 'react'
import { StyleProvider, Container, Button, Icon } from 'native-base'
import { Actions } from 'react-native-router-flux'
import throttle from 'lodash/throttle'
import { inject, observer } from 'mobx-react'
import getTheme from '../../native-base-theme/components'
import Header from '../../components/Header'
import Notifications from './Notifications'
import Orientation from 'react-native-orientation';
@inject('eventStore')
@observer
class NotificationsContainer extends Component {
  state = {
    page: 0
  }
  componentDidMount() {
    Orientation.lockToPortrait();
  }

  handleNextPage = throttle(() => {
    this.setState({ page: this.state.page + 1 })
  }, 500, { leading: true })

  render () {
    const { page } = this.state
    const event_id = this.props.eventStore.event.id
    const offline = this.props.eventStore.offline
    return (
      <StyleProvider style={getTheme(this.props.eventStore.theme)}>
        <Container>
          <Header
            headerTitle='Notifications'
            renderLeft={(
              <Button transparent onPress={Actions.drawerOpen}>
                <Icon name='md-menu' />
              </Button>
            )}
          />
          <Notifications
            page={page}
            handleNextPage={this.handleNextPage}
            eventID={event_id}
            offline={offline}
          />
        </Container>
      </StyleProvider>
    )
  }
}

export default NotificationsContainer
