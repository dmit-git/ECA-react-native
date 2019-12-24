import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import { Button, Text, Icon } from 'native-base'
import moment from 'moment'

export default class AgendaItemButton extends Component {
  constructor(props){
    super(props)    
  }

  state = {
    parent: 0,
    child: 0,
    showMoreButton: false,
  }
  showMoreButton = () => {
    this.setState({showMoreButton: true})
  }

  onLayoutParent = (event) => {
    this.state.parent = event.nativeEvent.layout.width
    if (this.state.child && this.state.parent) {
      this.state.child >= this.state.parent ?  this.showMoreButton() : null
    }
  }

  onLayoutChild = (event) => {
    this.state.child = event.nativeEvent.layout.width
    if (this.state.child && this.state.parent) {
      this.state.child >= this.state.parent ?  this.showMoreButton() : null
    }
  }

  render () {      
    const { brandPrimary, brandDark, listItemSelected } = this.props.theme;    
    const item = this.props.agendaItem
    const now = moment();
    const then = item.start_time;
    const dimItem = now.isBefore(item.start_time) ? {opacity: 1} : {opacity: 0.25};
    const highlightContainer = then.diff(now, 'minutes') <= 30 && then.diff(now, 'minutes') >= 1 ? {backgroundColor: listItemSelected} : {};
    const highlightText = then.diff(now, 'minutes') <= 30 && then.diff(now, 'minutes') >= 1 ? {color: brandPrimary, fontWeight: '600',} : {};
      
    return (
      !item.name ? <View/> : 
      <TouchableOpacity onPress={this.props.onPress} style={{...styles.item, ...dimItem, ...highlightContainer}}>                  
            <Text numberOfLines={1} style={{textAlign: "left", backgroundColor: 'yellow', position: 'absolute', height: 0}} onLayout={this.onLayoutChild}>{item.name}</Text>
            <View style={{...styles.itemDefaultContainer, ...styles.timeAndDateContainer}}>
              <Text style={{...styles.header, color: brandDark, ...highlightText}}>{`${item.start_time.format('h:mm a')}`}</Text>
              <Text style={{...styles.subHeader, color: brandDark, ...highlightText}}>{`${item.end_time.format('h:mm a')}`}</Text>
            </View>
            <View style={{...styles.itemDefaultContainer, ...styles.nameAndLocationContainer, }} onLayout={this.onLayoutParent}>
              <Text numberOfLines={1} style={{...styles.header, color: brandDark, ...highlightText}}>{item.name}</Text>
              <Text numberOfLines={1} style={{...styles.subHeader, color: brandDark, ...highlightText}}>{!item.location ? ' ': item.location}</Text>
            </View>
            <View style={{display: 'flex', flex: .5,  flexDirection: 'row', justifyContent: 'center', height: 96,}}>
              <Button                 
                onPress={this.props.onPress} 
                icon transparent primary                                 
                style={
                  this.state.showMoreButton ? {alignSelf: 'center',}:{display: 'none',}
                }
              >
                <Icon style={{color: brandPrimary}} name='ios-more' />
              </Button>
            </View>            
      </TouchableOpacity>

    )
  }
}
const styles = StyleSheet.create({
  item: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,.95)',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    
    elevation: 4,
    marginTop: 16,
  },
  itemDefaultContainer: {
    flex: 1, flexDirection: 'column', 
    justifyContent: 'center', alignItems: 'flex-start', 
    height: 96,
  },
  timeAndDateContainer: {    
    flex: .5,
    paddingLeft: 16,

  },
  nameAndLocationContainer: {
    alignSelf:'flex-start'
  },
  header: {
    color: '#3d3d3d',
    fontSize: 16,
  },
  subHeader: {
    color: '#3d3d3d',
    fontSize: 14,
    opacity: .75,
  },
  dayText: {
    fontWeight: '700'
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  }
})
