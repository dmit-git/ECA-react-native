import React from 'react'
import { AppState, YellowBox } from 'react-native';
import { ApolloProvider } from 'react-apollo'
import { Provider } from 'mobx-react'
import { Root } from 'native-base'
import codePush from 'react-native-code-push'
import apolloClient from './src/apolloClient'
import RootNavigation from './src/RootNavigation'

import authStore from './src/stores/authStore'
import chatStore from './src/stores/chatStore'
import eventStore from './src/stores/eventStore'
import analyticsStore from './src/stores/analyticsStore'
import authHistoryStore from './src/stores/authHistoryStore'

YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
  'Warning: componentWillUpdate is deprecated',
  'Remote debugger',
]);

class App extends React.Component {

  state = {
    appState: AppState.currentState,
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange(appState) {
    authHistoryStore.checkAppVersion(appState)
  }

  render () {
    return (
      <ApolloProvider client={apolloClient}>
        <Provider
          authStore={authStore}
          chatStore={chatStore}
          eventStore={eventStore}
          analyticsStore={analyticsStore}
          authHistoryStore={authHistoryStore}
        >
          <Root>
            <RootNavigation />
          </Root>
        </Provider>
      </ApolloProvider>
    )
  }
}

const codePushOptions = {
  updateDialog: { title: "An update is available!" },
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.IMMEDIATE,
};

export default codePush(codePushOptions)(App);
