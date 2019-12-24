import React, { Component } from 'react'
import { StyleProvider } from 'native-base'
import isEmpty from 'lodash/isEmpty'
import debounce from 'lodash/debounce'
import codePush from 'react-native-code-push'
import { Actions } from 'react-native-router-flux'
import { inject, observer } from 'mobx-react'
import getTheme from '../../native-base-theme/components'
import Home from './Home'
import Loading from '../../components/Loading'
import Orientation from 'react-native-orientation';

@inject('eventStore', 'authStore', 'analyticsStore')
@observer
class HomeQuery extends Component {
  state = {
    groupIDs: this.props.authStore.groupIDs,
    loading: false
  }

  componentDidMount () {
    this.props.analyticsStore.sendScreenView('Home')
    Orientation.lockToPortrait();
    // Orientation.unlockAllOrientations();
  }

  // componentDidUpdate () {
  //   if (!this.state.event && !this.state.loading) this.handleEventFetch()
  // }

  handleFetchEvent = debounce(async () => {
    try {
      this.setState({ loading: true })
      // these codepush options don't appear to be
      // applied currently for some reason
      let codePushOptions = {
        updateDialog: { title: "An update is available!" },
        installMode: codePush.InstallMode.IMMEDIATE,
      };
      codePush.sync(codePushOptions);
      const attendee = await this.props.authStore.sync()
      const event    = await this.props.eventStore.fetchEvent()
      if (event && attendee) {
        this.setState({
          event,
          groupIDs: attendee.groups ? attendee.groups.map(({ id }) => id) : [],
          loading: false
        })
      }
    } catch (e) {
      console.log('EventStore.fetchEvent error', e)
    }
  }, 500, { leading: true })

  render () {
    const { loading, groupIDs } = this.state
    const { event, theme } = this.props.eventStore
    if (!isEmpty(event) && !loading) {
      return (
        <StyleProvider style={getTheme(theme)} >
          <Home
            event={event}
            groupIDs={groupIDs}
            handleRefresh={this.handleFetchEvent}
          />
        </StyleProvider>
      )
    } else {
      return <Loading />
    }
  }
}

HomeQuery.onEnter = (props) => {
  Actions.refresh(props)
}

export default HomeQuery
