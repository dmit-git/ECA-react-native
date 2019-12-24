import React, { Component } from 'react';
import { Button, Text } from 'native-base';
import { Actions } from 'react-native-router-flux';
import buttonStyles from './QRStyles';

export default class ConnectButton extends Component {

  handlePress = () => {
    const { onPress, onShowConnect } = this.props;
    if( onPress ){
      onPress();
    }
    // Actions.push('connections', { initialPage: 0 });
    onShowConnect();
  }

  render () {
    return (
      <Button primary style={buttonStyles.primaryButton} onPress={this.handlePress}>
        <Text>
          {this.props.children || 'Connect'}
        </Text>
      </Button>
    )
  }
}
