import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Fragment } from 'react-native';
import QRCodeDisplay from './QRCodeDisplay';
import QRCamera from './QRCamera';
import QRButtons from './QRButtons';
import ConnectSuccessModal from './ConnectSuccessModal';
import base64 from 'react-native-base64';

const { width, height } = Dimensions.get('window');

export default class Networking extends Component {
  state = {
    showQRCamera: false,
    showConnectSuccessModal: false,
  }

  componentDidUpdate (prevProps) {
    if (prevProps.lastConnection !== this.props.lastConnection) {
      this.showConnectSuccessModal();
    }
  }

  toggleQRCamera = () => {
    this.setState({ showQRCamera: !this.state.showQRCamera });
  }

  toggleConnectSuccessModal = () => {
    this.setState({ showConnectSuccessModal: !this.state.showConnectSuccessModal });
  }

  showConnectSuccessModal = () => {
    this.setState({ showConnectSuccessModal: true });
  }

  handleQRScanned = data => {
    if(this.hasIncorrectChars(data)){
      return;
    }
    // const email = base64.decode(data);
    // if(!this.isValidEmail(email)){
    //   return;
    // } 
    // console.log("connect to: " + email);
    // this.props.onConnect(email);

    const idString = base64.decode(data);
    const id = parseInt(idString);
    if(!this.isValidId(id)){
      return;
    } 
    console.log("connect to: " + id);
    this.props.onConnect(id);
  }

  isValidId = id => {
    return !isNaN(id);
  }

  // isValidEmail = email => {
  //   const emailTest = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i; 
  //   return emailTest.test(email);
  // }

  hasIncorrectChars = data => {
    const base64test = /[^A-Za-z0-9\+\/\=]/g;
    return base64test.exec(data);
  }

  render () {
    const { attendee, lastConnection, onShowConnections } = this.props;
    const { showQRCamera, showConnectSuccessModal } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.qrcontainer}>
          <QRCodeDisplay 
            attendee={attendee}
            size={width}
          />
        </View>
        <View style={styles.buttonsContainer}>
          <QRButtons
            onShowCamera={this.toggleQRCamera}
            onShowConnections={onShowConnections}
          />
        </View>
        <QRCamera
          isVisible={showQRCamera}
          onHideCamera={this.toggleQRCamera}
          onQRScanned={this.handleQRScanned} 
        />
        <ConnectSuccessModal
          isVisible={showConnectSuccessModal}
          onHideModal={this.toggleConnectSuccessModal}
          connection={lastConnection}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: width,
  },
  qrcontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    minHeight: width * 0.8,
    marginTop: 40,
    marginBottom: 40,
    // backgroundColor: '#3399aa',
  },
  buttonsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    padding: width * 0.02,
  }
});
