import React, { Component } from 'react';
import { StyleSheet, View, Modal, Dimensions } from 'react-native';
import { Button, Text } from 'native-base';
import QRCodeScanner from 'react-native-qrcode-scanner';
import buttonStyles from './QRStyles';

const { width, height } = Dimensions.get('window');

export default class QRCamera extends Component {

  handleBarCodeScanned = ({ type, data }) => {
    // console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
    this.props.onQRScanned(data);
    this.hideModal();
  }

  hideModal = () => {
    this.props.onHideCamera();
  }   

  render() {
    const { isVisible } = this.props;

    if( isVisible === false ){
      return null;
    }          

    return (
      <View style={styles.container}>
        <Modal visible={isVisible} onRequestClose={this.hideModal}>
          <View style={styles.viewStyles}>
            <QRCodeScanner
              onRead={this.handleBarCodeScanned}
              topContent={null}
              bottomContent={null}
              cameraStyle={{height: height}}
              cameraProps={{captureAudio: false}}
            />
            <View style={styles.buttonsContainer}>
              <Button primary style={buttonStyles.primaryButton} onPress={this.hideModal}>
                <Text>Cancel</Text>
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    height: 0,
  },
  viewStyles: {
    width: width,
    height: height,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonsContainer: {
    padding: width / 12,
  }
});
