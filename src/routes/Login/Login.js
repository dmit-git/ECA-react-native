import React, { Component, Fragment } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ImageBackground,
  Keyboard,
  Animated,
} from 'react-native'
import { Form, Item, Label, Input, Button, Text, Container } from 'native-base'
import FlexImage from 'react-native-flex-image'
import { nullLiteral } from '@babel/types';

const Constants = require ('../../../app.json')

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

const {
  CLIENT_NAME,
  EXTERNAL_AUTH_CLIENT_URL
} = Constants.expo.extra

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class Login extends Component {
  state = {
    email: '',
    password: '',
    fadeAnim: new Animated.Value(0),
  }

  componentDidMount() {
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this.fadeBackgroundToGrey,
    );
  }

  fadeBackgroundToGrey = () => {
    Animated.timing(
      this.state.fadeAnim,
      { toValue: 1, duration: 1000 }
    ).start();
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
  }

  signIn = () => {
    const {email, password} = this.state
    if (/.+@.+\..+/.test(email) && password.length >= 0) {
      this.props.handleSubmit(this.state)
    }
    return
  }
  handleSetState = (name) => (val) => this.setState({ [name]: val })

  render() {
    let { fadeAnim } = this.state;
    var bgColor = fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(30, 44, 70, 0)', 'rgba(30, 44, 70, 1)']
    });

    const loginBody = (
      <Animated.View style={[styles.container, {
        width: width,
        backgroundColor: bgColor,
      }]}>
        <FlexImage source={require('../../../assets/logo.png')} resizeMode="contain" style={styles.logoStyle} />
        <MyStatusBar backgroundColor="#5E8D48" barStyle="light-content" />
        <View style={styles.block}>
          {/* <FlexImage style={styles.banner} source={require('../../../assets/banner.png')}/> */}
          <Form>
            <Item stackedLabel last>
              <Input
                style={styles.form_input}
                placeholder="Email"
                keyboardType='email-address'
                textContentType='emailAddress'
                autoCapitalize ='none'
                value={this.state.email}
                onChangeText={this.handleSetState('email')}
              />
            </Item>

            <Item stackedLabel last>
              <Input
                placeholder="Password"
                style={styles.form_input}
                secureTextEntry
                textContentType='password'
                value={this.state.password}
                onChangeText={this.handleSetState('password')}
              />
            </Item>
          </Form>
          <Button full large dark onPress={this.signIn} style={styles.login} >
            <Text> Login </Text>
          </Button>
        </View>
      </Animated.View>
    );

    return (
      <ImageBackground source={require('../../../assets/login_background.png')}
        style={styles.container}

        imageStyle={{
          resizeMode: 'cover' // works only here!
        }}
      >
        <View style={styles.container}>
        {

          (Platform.OS == 'ios') ?
          <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
            { loginBody }
          </KeyboardAvoidingView>
            :
          <Container>
            { loginBody }
          </Container>
        }
      </View>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "#c9c9c9",
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    width: width - 40,
    marginBottom: 40
  },
  block: {
    top: 0
  },
  form_input:{
    borderRadius: 2,
    backgroundColor: "white",
    fontSize: 18,
    lineHeight: 22,
    marginLeft: -15,
    paddingLeft: 35,
    marginTop: 10,
  },
  login: {
    backgroundColor: "#60a9fc",
    borderRadius: 2,
    marginTop: 25,
    width: width - 80,
    alignSelf: 'center',
  },
  logoStyle: {
    width: width * 0.7,
    marginBottom: width * 0.1,
  },
})
