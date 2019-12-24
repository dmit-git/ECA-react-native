import React from 'react'
// import url from 'url'
import { Actions } from 'react-native-router-flux'
import { Dimensions } from 'react-native'
import { WebView } from 'react-native-webview'
import { Container, Button, Icon } from 'native-base'
import Header from '../../components/Header'

export default ({ uri, token }) => {
  var { width } = Dimensions.get('window')
  // TODO parse url and add token with url/querystring package
  // const uriWithToken = `${uri}?token=${token}`
  
  return (
    <Container>
      <Header
        headerTitle={''}
        renderLeft={(
          <Button transparent onPress={Actions.pop}>
            <Icon name='md-close' />
          </Button>
        )}
      />
      <WebView
        style={{ flex: 1, width }}
        javaScriptEnabledAndroid
        allowsInlineMediaPlayback
        source={{ uri }}
        bounces={false}
      />
    </Container>
  )
}
