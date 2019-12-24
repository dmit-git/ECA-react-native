import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Button, Text } from 'native-base';
import buttonStyles from './QRStyles';
import ViewConnectionsButton from './ViewConnectionsButton';

const { width, height } = Dimensions.get('window');

export default class QRButtons extends Component {
  handleLaunchQRCamera = () =>{
    this.props.onShowCamera();
  };

  render () {
    const { onShowConnections } = this.props;
    return (
      <View style={styles.buttonContainer}>
        <Button primary style={buttonStyles.primaryButton} onPress={this.handleLaunchQRCamera}>
          <Text style={styles.primaryButtonText}>
            Scan QR
          </Text>
        </Button>
        <ViewConnectionsButton onShowConnections={onShowConnections} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width,
    padding: width * 0.02,
  },
});
