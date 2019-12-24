import React, { Component } from 'react';
import { Button, Text } from 'native-base';
import { Actions } from 'react-native-router-flux';
import buttonStyles from './QRStyles';

export default class ViewConnectionsButton extends Component {

  handlePress = () => {
    if( this.props.onPress ){
      this.props.onPress();
    }
    this.handleShowConnections();
  }

  handleShowConnections = () => {
    if(Actions.currentScene === 'connections' && this.props.onShowConnections){
      this.props.onShowConnections();
    }else{
      Actions.push('connections', { initialPage: 1 });
    }
  };

  render () {
    return (
      <Button transparent onPress={this.handlePress}>
        <Text style={buttonStyles.transparentButtonText}>
          {this.props.children || 'View Connections'}
        </Text>
      </Button>
    )
  }
}
