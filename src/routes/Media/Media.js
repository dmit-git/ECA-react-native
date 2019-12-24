import React, { Component, Fragment } from 'react'
import get from 'lodash/get'
import { StyleSheet, View, Dimensions, Linking,Platform } from 'react-native'
import { WebView } from 'react-native-webview'
import { Actions } from 'react-native-router-flux'
import { Container, Button, Icon } from 'native-base'
import FlexImage from 'react-native-flex-image'
import Header from '../../components/Header'
import analyticsStore from '../../stores/analyticsStore'
import { sources } from '../../assetCache'
import { assetFromID } from '../../assetUtils'
import Orientation from 'react-native-orientation';

export default class Media extends Component {
  
  videoRef = React.createRef()

  constructor(props) {
    super(props)
  }


  componentDidMount() {
    Orientation.unlockAllOrientations();
    analyticsStore.sendScreenView(`Media - ${this.props.media.name}`)    
  }


  componentWillUnmount() {
    Orientation.lockToPortrait();
    if (get(this.videoRef, ['current', 'unloadAsync'])) {
      this.videoRef.current.unloadAsync()
    }
  }

  openPdfInBrowser = (url) => {
    Linking.canOpenURL(url)
    .then(supported => {
      if(supported) {
         Linking.openURL(url)
        Actions.reset('event')
      }
      else {
        alert ("Please Try again after Sometime")
      }
    })
    .catch(err => {
      console.log("Open PDF IN Browser Error..",err);
      alert("Error! Try Again.")
    })
  }

  render() {
    const { media, local } = this.props
    const videoSource = local ? sources[String(media.id)] : media.src;
    const [prefix, extension] = this.props.media.mime_type.split('/')    

    return (
      <Container>
        <Header
          headerTitle={media.name}
          renderLeft={(
            <Button transparent onPress={Actions.pop}>
              <Icon name='md-arrow-back' />
            </Button>
          )}
        />
        {
          prefix === 'image' ? (
            <View style={styles.flexImage}>
              <FlexImage source={local
                ? sources[String(media.id)]
                : { uri: media.src }}
              />
            </View>
          ) : <Fragment />
        }
        {
          prefix === 'video' ? (
            
              <WebView                                 
                style={{backgroundColor: 'black'}}
                javaScriptEnabled = {true}
                allowsInlineMediaPlayback = { true }
                mediaPlaybackRequiresUserAction= {false}
                source={{html:
                  
                  `                  
                  <body 
                    style="                      
                      margin: 0; padding: 0;
                      background-color: black; 
                      height: 100vh;
                      display: flex; 
                        flex-direction: column; 
                        justify-content: center; 
                        align-items: center;
                  >  
                    <div 
                      style="
                        position: fixed;
                        top: 0; bottom: 0;
                        left: 0; right: 0;
                        margin: 0 auto; 
                        background-color: green; 
                        height: 100vh;                        
                      "
                    >
                      <video 
                        autoplay
                        controls 
                        src='${videoSource}'
                        style="width: 94%; max-height: 96%;"                        
                      />
                    </div>
                  </body>
                  `
                }}
              />              
          ) : <Fragment />
        }
        {
          extension === 'pdf' ? ( 
            (Platform.OS === 'android')? (this.openPdfInBrowser(media.src)) : (
                      <WebView
                      source={{ uri: local ? assetFromID(media.id).localUri : media.src }}
                      style={{marginTop: 5}}
                      javaScriptEnabled = {true}
                    /> 
            )
          ) : <Fragment />
        }
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  flexImage: {
    flex: 1,
    justifyContent: 'center'
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  }
})
