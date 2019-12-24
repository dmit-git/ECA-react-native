import React, { Component } from 'react';
import { StyleSheet, View, Modal, Dimensions, Fragment } from 'react-native';
import { Thumbnail, Button, Text } from 'native-base';
import buttonStyles from './QRStyles';
import ViewConnectionsButton from './ViewConnectionsButton';

const { width, height } = Dimensions.get('window');

// this could be broken apart into a modal component and a content (body) component
export default class ConnectSuccessModal extends Component {

  hideModal = () => {
    this.props.onHideModal();
  }

  render() {
    const { isVisible, connection } = this.props;

    if( isVisible === false ){
      return null;
    }

    let body = (
      <View style={styles.body}>
        <Text style={styles.mediumText}>You are already connected.</Text>
        <View>
          <ViewConnectionsButton onPress={this.hideModal}>
            See your connections
          </ViewConnectionsButton>
        </View>
      </View>
    );

    if( connection && connection.first_name ){
      const connectionFullName = connection.first_name + ' ' + connection.last_name;
      console.log("You are now connected to " + connectionFullName);
      body = (
        <View style={styles.body}>
          <Text style={styles.headerText}>Success!</Text>
          <Text style={styles.mediumText}>You are now connected to...</Text>
          <Thumbnail style={styles.thumbnail} source={{ uri: connection.avatar_url }} />
          <Text style={styles.mediumText}>{connectionFullName}</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Modal
          visible={isVisible}
          onRequestClose={this.modalClosed}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.viewWrapper}>
            <View style={[styles.viewStyles]}>
              { body }
              <View style={styles.buttonsContainer}>
                <Button primary style={buttonStyles.primaryButton} onPress={this.hideModal}>
                  <Text>Okay</Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const flexColumn = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};
const dropShadow = {
  shadowColor: 'black',
  shadowOpacity: 0.2,
  shadowRadius: width * 0.01,
  elevation: 10, // for android
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    height: 0,
    // backgroundColor: '#ffaa00',
  },
  viewWrapper: {
    flex: 1,
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewStyles: {
    ...dropShadow,
    ...flexColumn,
    justifyContent: 'space-between',
    width: width * 0.9,
    height: width * 0.3 + height * 0.3,
    borderRadius: width * 0.01,
    backgroundColor: 'white',
  },
  body: {
    ...flexColumn,
    // backgroundColor: '#009944',
    height: '65%',
    marginTop: width / 20,
  },
  thumbnail: {
    height: width / 6,
    width: width / 6,
    borderRadius: width / 12,
    marginTop: width / 30,
    marginBottom: width / 100,
  },
  mediumText: {
    fontSize: width / 38,
  },
  headerText: {
    fontSize: width / 20,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    marginBottom: width / 14,
    marginTop: width / 20,
  }
});
