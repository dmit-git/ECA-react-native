import React, { Component } from 'react'
import { StyleProvider } from 'native-base'
import { inject, observer } from 'mobx-react'
import getTheme from '../../native-base-theme/components'
import WebView from './WebView'
import Orientation from 'react-native-orientation';

@inject('eventStore', 'analyticsStore')
@observer
class WebViewContainer extends Component {

  componentDidMount () {
    Orientation.unlockAllOrientations();
    Orientation.addOrientationListener(this._orientationDidChange);
    this.props.analyticsStore.sendScreenView(this.props.uri);
  }

  componentWillUnmount () {
    Orientation.removeOrientationListener(this._orientationDidChange);
    Orientation.lockToPortrait();
  }

  // componentWillUnmount() {
  //   Orientation.getOrientation((err, orientation) => {
  //     console.log(`Current Device Orientation: ${orientation}`);
  //   });


  //   // Remember to remove listener
  //   Orientation.removeOrientationListener(this._orientationDidChange);
  // }

  _orientationDidChange = (orientation) => {
    this.forceUpdate();
    // if (orientation === 'LANDSCAPE') {
    //   // do something with landscape layout
    // } else {
    //   // do something with portrait layout
    // }
  }


  render () {
    const { uri } = this.props;
    return (
      <StyleProvider style={getTheme(this.props.eventStore.theme)}>
        <WebView uri={uri} />
      </StyleProvider>
    )
  }
}

export default WebViewContainer
