import React, { PureComponent } from 'react'
import Url from 'url'
import { Actions } from 'react-native-router-flux'
import { AsyncStorage, Dimensions } from 'react-native'
import { WebView } from 'react-native-webview'
import { Container } from 'native-base'
import { OAUTH_LOGIN_URL } from '../../config'
import alert from '../../alert'
import Orientation from 'react-native-orientation';

function handleError () {
  alert('Connection error occured while logging in. If this problem persists, contact your administrator.')
  Actions.replace('login')
}

export default class OAuthWebView extends PureComponent {
  handleNavigationStateChange = async ({ code, url }) => {
    if (code < 0) handleError()
    const parsedUrl = Url.parse(url, true)
    const paths = parsedUrl.pathname.split('/')
    if (paths.indexOf('failure') > -1) handleError()
    if (paths.indexOf('success') > -1) {
      const token = parsedUrl.query.token
      console.log('query token ', token)
      if (token) {
        await AsyncStorage.setItem('token', token)
        Actions.replace('handleToken')
      } else handleError()
    }
  }

  componentDidMount() {
    Orientation.lockToPortrait();
  }

  render () {
    var { width } = Dimensions.get('window')
    return (
      <Container>
        <WebView
          style={{ flex: 1, width }}
          javaScriptEnabledAndroid
          source={{ uri: OAUTH_LOGIN_URL }}
          bounces={false}
          onNavigationStateChange={this.handleNavigationStateChange}
        />
      </Container>
    )
  }
}
