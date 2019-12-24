import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import { Text, Icon } from 'native-base'
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

import ArrowButton from './ArrowButton.js';
import MeasuringTable from '../../components/MeasuringTable/';

export default class NotificationItem extends Component {
  constructor(props){
    super(props)
    TimeAgo.addLocale(en);
    this.timeAgo = new TimeAgo('en-US')
    this.state = {
      showMoreButton: false
    }
  }
  showMoreButton = () => {
    this.setState({showMoreButton: true})
  }

  render () {      
    const {theme, name, body, link, time, index, handleClickNotification, storeUnReadNotification, isExpanded, handleExpand } = this.props;
    const { brandPrimary, listItemSelected } = theme;
    const isUnread = storeUnReadNotification !== 999 && index < storeUnReadNotification;
    return (
        <TouchableOpacity disabled={!link} style={{ ...styles.item, backgroundColor: isUnread ? listItemSelected : styles.item.backgroundColor }} onPress={handleClickNotification(link)}>          
            {link ? <Icon style={{...styles.subHeader, fontSize: 14, position: 'absolute', right: 8,}} name='md-link' /> : null}
            
            <View style={{...styles.itemDefaultContainer, ...styles.timeAndDateContainer}}>                        
                <Text style={{...styles.subHeader, color: brandPrimary, alignSelf: 'center'}}>{this.timeAgo.format(new Date(time))}</Text>                
            </View>

            <MeasuringTable style={{...styles.itemDefaultContainer, paddingTop: 8, paddingBottom: 8,}} textIsOverflowing={this.showMoreButton}>
                <Text numberOfLines={ isExpanded ? null : 1 } style={{ ...styles.header, color: brandPrimary  }}>{ name }</Text>
                <Text numberOfLines={ isExpanded ? null : 2 } style={{ ...styles.subHeader, color: brandPrimary  }}>{ body }</Text>
            </MeasuringTable>
            
            
            <View style={{display: 'flex', flex: .5,  flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: styles.itemDefaultContainer.minHeight,}}>
              
              {
                this.state.showMoreButton ? 
                  <ArrowButton isExpanded={isExpanded} brandPrimary={brandPrimary} onPress={() => { handleExpand(index) }}/>
                  : null
              }
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
      minHeight: 96,
    },
    timeAndDateContainer: {    
      flex: .5,
      paddingLeft: 16,
      marginRight: 8,  
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
      fontSize: 12,
      opacity: .75,
    },
})
  

