import React, { Component } from 'react'
import { 
  StyleProvider,
  Container,
  Text,
  Button,
  Icon,
  Tab,
  Tabs,
} from 'native-base'
import { Actions } from 'react-native-router-flux'
import analyticsStore from '../../stores/analyticsStore';
import throttle from 'lodash/throttle';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import { inject, observer } from 'mobx-react'
import getTheme from '../../native-base-theme/components'
import Header from '../../components/Header'
import Networking from '../../components/Networking';
import Connections from './Connections'
import SearchForm from './SearchForm'
import Orientation from 'react-native-orientation';
let Constants = require('../../../app.json');
const { CLIENT_ID } = Constants.expo.extra;

@inject('eventStore', 'authStore')
@observer
class ConnectionsContainer extends Component {
  constructor (props) {
    super(props);
    this.currentTab = this.props.initialPage || 0;
    this.state = {
      event: this.props.eventStore.event,
      loading: false,
      tab: this.currentTab,
    }
  }
  componentDidMount () {
    Orientation.lockToPortrait();
    analyticsStore.sendScreenView('Connections');
  }
  componentDidUpdate (prevProps) {
    if (!this.state.event && !this.state.loading) this.handleEventFetch()
    if (prevProps.initialPage !== this.props.initialPage) {
      this.switchToTab(this.props.initialPage);
    }
  }

  handleFetchEvent = debounce(async () => {
    try {
      this.setState({ loading: true })
      const event = await this.props.eventStore.fetchEvent()
      
      if (event) {
        this.setState({
          event,
          loading: false
        })
      }
    } catch (e) {
      console.log('EventStore.fetchEvent error', e)
    }
  }, 500, { leading: true })

  handleToggleTab = () => {
    const newTab = this.currentTab === 1 ? 0 : 1;
    this.switchToTab(newTab);
  }

  switchToTab = tab => {
    this.currentTab = tab;
    this.setState({tab: this.currentTab});
  }

  onChangeTab = ({i}) => {
    this.currentTab = i;
  }

  render () {
    const { event, loading, tab } = this.state;
    const { authStore, initialPage } = this.props;

    const clientID = CLIENT_ID;
    const eventID = event.id;
    const attendee = authStore.profile;
    const attendeeID = attendee.id;

    if (!isEmpty(event) && !loading) {
      return (
        <StyleProvider style={getTheme(this.props.eventStore.theme)}>
          <Container>
            <Header
              headerTitle='Connections'
              renderLeft={(
                <Button transparent onPress={Actions.pop}>
                  <Icon name='md-arrow-back' />
                </Button>
              )}
            />
            <Tabs initialPage={initialPage} page={tab} onChangeTab={this.onChangeTab}>
              <Tab heading="Connect">
                <Networking 
                  attendee={attendee}
                  onShowConnections={this.handleToggleTab}
                />
              </Tab>
              <Tab heading="Connections">
                <Connections
                  clientID={clientID}
                  eventID={eventID}
                  attendeeID={attendeeID}
                  onShowConnect={this.handleToggleTab}
                />
              </Tab>
            </Tabs>
          </Container>
        </StyleProvider>
      )
    } else{
      return <Text>Loading...</Text>;
    }
  }
}

export default ConnectionsContainer
