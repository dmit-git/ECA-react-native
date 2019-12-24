import React, { PureComponent, Fragment } from 'react'
import { Actions } from 'react-native-router-flux'
import { Dimensions } from 'react-native'
import { WebView } from 'react-native-webview'
import { Content, Container, Icon, Button } from 'native-base'
import DynamicLayout from '../../components/DynamicLayout'
import Header from '../../components/Header'
import analyticsStore from '../../stores/analyticsStore'
import Orientation from 'react-native-orientation';

const renderBody = (body, groupIDs) => {
  if (body.rows.length > 0) {
    return (
      <Content>
        <DynamicLayout layout={body} groupIDs={groupIDs} />
      </Content>
    )
  } else if (body.__html) {
    var { height, width } = Dimensions.get('window')
    return (
      <Content>
        <WebView
          style={{ height, width }}
          javaScriptEnabledAndroid
          allowsInlineMediaPlayback
          source={{html: body.__html}}
          bounces={false}
        />
      </Content>
    )
  } else return <Fragment />
}

export default class Page extends PureComponent {
  componentDidMount () {
    Orientation.lockToPortrait();
    analyticsStore.sendScreenView(`Page - ${this.props.page.name}`)
  }

  render () {
    const { page: { name, body }, groupIDs } = this.props
    return (
      <Container>
        <Header
          headerTitle={name}
          renderLeft={(
            <Button transparent onPress={Actions.pop}>
              <Icon name='md-arrow-back' />
            </Button>
          )}
        />
        {renderBody(body, groupIDs)}
      </Container>
    )
  }
}
