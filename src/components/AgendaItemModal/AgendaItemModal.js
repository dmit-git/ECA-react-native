import React, { Component, Fragment } from 'react'
import moment from 'moment'
import { StyleSheet, Modal, View, ScrollView, Dimensions } from 'react-native'
import { ListItem, Text, Left, Body, Icon, Button, Right } from 'native-base'
import TemplateText from '../../components/TemplateText'
import HTMLView from 'react-native-htmlview';

const { width, height } = Dimensions.get('window');

export default class AgendaItemModal extends Component {
  render () {
    const { id, name, description, start_time, end_time, location } = this.props.agendaItem
    const { variables: colorVariables } = this.props.theme
    const date = moment(start_time, moment.ISO_8601)
    const endDate = moment(end_time, moment.ISO_8601)
    const locationHeight = (location.length / 2) + 15

    return (
    
        <View >
          <Modal
            visible={this.props.visible}
            onRequestClose={this.modalClosed}
            animationType="fade"
            transparent={true}
          >
            <View style={styles.positioning}>
              <View style={styles.container}>
                <Button icon transparent primary onPress={this.props.closeModal} style={{alignSelf: 'flex-end', marginRight: -16,}} >
                  <Icon style={{color: colorVariables.brandDark, opacity: 0.75}} name='ios-close-circle' />
                </Button>
                <Text style={{fontSize: 20, fontWeight: '600', color: colorVariables.brandDark, marginBottom: 4}}>{name}</Text>
                <Text style={{fontSize: 16, color: colorVariables.brandDark, opacity: 0.75, marginBottom: 24}}>Location: {location}</Text>
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24}}>
                  <Text style={{fontSize: 16, color: colorVariables.brandWarning}}>{date.format('dddd, MMMM D')}</Text>
                  <Text style={{fontSize: 16, color: colorVariables.brandWarning}}>{date.format('h:mm')} - {endDate.format('h:mm a')}</Text>                  
                </View>                
                {!description || description === '<p><br></p>' ? <View/> :
                <ScrollView style={{ borderRadius: 4, borderWidth: 1, borderColor: 'lightgrey', padding: 16}}>
                  <HTMLView
                      value={description}
                      style={{paddingBottom: 64}}
                  />                    
                </ScrollView> 
                }
              </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  positioning: {
    width, height,
    display: 'flex', flexDirection: 'column', 
    justifyContent: 'center', alignItems: 'center',
  },
  container: {    
    width: width * .9,
    height: height * .56,
    backgroundColor: 'white',
    borderRadius: 4,
    paddingTop: 8, paddingBottom: 24, 
    paddingLeft: 24, paddingRight: 24,    
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    
    elevation: 4,
  }
})
