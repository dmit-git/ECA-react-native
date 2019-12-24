import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Text } from 'native-base';
import ConnectButton from './ConnectButton';

const { width, height } = Dimensions.get('window');

export default class NoConnections extends Component {
  render () {
    const { onShowConnect } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Looks like you haven't connected with anyone yet
        </Text>
        <View>
          <ConnectButton onShowConnect={onShowConnect} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: width,
  },
  text: {
    width: width * 0.6,
    marginBottom: width * 0.05,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
