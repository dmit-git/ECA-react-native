import React, { Component } from 'react'
import moment from 'moment'
import { Actions } from 'react-native-router-flux'
import { FlatList, StyleSheet, View, Image, TouchableOpacity, AsyncStorage} from 'react-native'
import { inject, observer } from 'mobx-react'
import { Content, ListItem, Body, Left, Text, Right, Icon, Container, Button, Header } from 'native-base'
import Orientation from 'react-native-orientation';
import {Mutation} from "react-apollo";

@inject('eventStore', 'analyticsStore', 'authStore', 'authHistoryStore')
@observer
class AttendeeEvents extends Component {

  state = {
    refreshing: false
  }
  
  async componentDidMount() {
    Orientation.lockToPortrait();
  }
  
  getStorage = async (params) => {
    let tkn = await AsyncStorage.getItem(params);
    return tkn;
  }

  handleLogout = async (logout)  => {
    this.props.analyticsStore.sendScreenView('Logout');
    let Token = await this.getStorage("fcmToken");
    if(!Token) {
         Token="";
    }
    var variables={pushToken: Token};
     logout({variables}).then(()=>{
         this.props.authStore.logout();
     });
 };


  handleClick = (obj) => () => this.handleEventNavigation(obj)

  keyExtractor = (item, index) => String(item.id)

  renderItem = ({ item }) => (
    <ListItem
      style={{
        marginLeft: 8, marginRight: 8, marginTop: 6, marginBottom: 6, backgroundColor: '#ffffff', height: 80, elevation: 3, borderRadius: 8,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      }}
      onPress={this.handleClick(item)}
    >
      <Left>

          {
            (item.event_image_url==null||item.event_image_url == "")?
            <Image
              style={{ width: 60, height: 60, marginRight: 4, marginLeft: 5, borderRadius: 30, }}
              source={require('../../../assets/BlueprintNYC_AppIcon_400px.png')}
            />
          :
            <Image
              style={{ width: 60, height: 60, marginRight: 4, marginLeft: 5, borderRadius: 30, }}
              source={{uri: item.event_image_url}}
            />
          }

          <Text style={{ fontSize: 16 }} >{item.name}</Text>
          <Text note style={styles.note}>
            {`${moment(item.start_time, moment.ISO_8601).format('MM/DD')}`}
          </Text>
      </Left>
      <Right>
        <Icon name='md-arrow-forward' style = {{color: 'gray'}}/>
      </Right>
    </ListItem>
  )

  async handleEventNavigation(event) {
    try {
      const result = await this.props.eventStore.fetchEvent(event.id)
      if (result) {
        this.props.analyticsStore.initGoogleAnalytics(event.analytics_id)
        this.props.analyticsStore.sendEvent({ category: 'Event', action: 'press', label: event.name })
        this.props.eventStore.setEventAttendeeMetadata(JSON.parse(event.attendee_metadata.metadata || '{}'))
        Actions.reset('event', { id: event.id })
      }
    } catch (e) {
      console.log('AttendeeEvents.handleEventNavigation error', e)
      alert('Something went wrong! If this problem persists, contact your administrator.')
    }
  }

  render() {
    const { events, refetch, authStore, authHistoryStore, LOGOUT} = this.props
    return (
      <Container>
        <Header style={styles.headerStyle}>
          <Left>
            <Text style={[styles.text, {fontSize: 15}]}> 
              Welcome, {authStore.profile.first_name} {authStore.profile.last_name}
            </Text>
            <Text style={[styles.text, {fontSize: 12}]}>
              Version: {authHistoryStore.appVersion}
            </Text>
          </Left>
          <Right> 
            <Mutation mutation={LOGOUT}>
              {(logout) => {
                  return (
                    <Button transparent onPress={() => this.handleLogout(logout)}>
                      <Text style={[styles.text, {fontSize: 15}]}> 
                        Sign out 
                      </Text>
                    </Button>
                  )
              }}
            </Mutation>
          </Right>
        </Header>

        <View style={styles.selectEvent}>
          <Text style={[styles.text, {fontSize: 25, textAlign: 'center'}]}> 
            Select your event 
          </Text>
        </View>

        <View style={[styles.container, {height: "100%"}]}>
          <FlatList
            keyExtractor={this.keyExtractor}
            data={events}
            onRefresh={refetch}
            refreshing={this.state.refreshing}
            renderItem={this.renderItem}
            ListEmptyComponent={(
              <View style={styles.emptyDate}>
                <Text>No active events. Check back later!</Text>
              </View>
            )}
            ListFooterComponent={(
              <View style={{marginTop: 30, flex: 1, justifyContent: 'flex-start'}}>
                <TouchableOpacity style={{alignItems:'center', justifyContent: 'center', flexDirection:'row'}} onPress={() => refetch()}>
                  <Icon name='md-sync' style={{color: 'gray',}} />
                  <Text style={{color: 'gray', margin: 5,}}> 
                      Refresh list
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  note: {
    marginLeft: 5
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  text:{color: 'white', fontWeight: "600"},
  selectEvent: {backgroundColor: "black", height: 40},
  headerStyle: {backgroundColor: "black", height: 74, borderBottomColor: "black"}
})

export default AttendeeEvents
