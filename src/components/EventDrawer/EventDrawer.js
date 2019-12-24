import React, { Component, Fragment } from 'react'
import { Container, Left, Icon, Text, ListItem, Right, Badge } from 'native-base'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { Actions } from 'react-native-router-flux'
import drawerItems from './drawerItems';
import { _getNotificationUnRead , _setNotificationUnRead,Store } from '../../stores/NotificationStore';
// import moment from 'moment'
// import { from } from 'zen-observable';

class DrawerContent extends Component {
  handlePress = (type, id) => () => {
    if (id) return Actions.push(type, { id })
    Actions.push(type)
  }

  handleAttendeeEvents = () => {
    Actions.reset('attendeeEvents')
  }

  handleMyAccount = () => {
    Actions.push('attendeeDetail', { id: this.props.myID })
  }

  keyExtractor = (item, index) => String(item.name)

  renderItem = ({ name, type, icon, id, offlineDisable }, i) => {
    // const { unreadNotifications } = this.props
    if (offlineDisable && this.props.offline) return <Fragment key={String(i)} />
    return (
      <ListItem
        key={String(i)}
        noBorder
        onPress={this.handlePress(type, id)}
      >
        <Left>
          <Icon name={icon} style={{ fontSize: 30, width: 36, color: this.props.iconColor }} />
          <Text style={styles.text}>
            {name}
          </Text>
        </Left>
        { (type === 'notifications' && Store.UnReadNotificationFromStore < 999) ? ( // We do this because our database doesn't let us set a field to 0, so 999 is essentially our zero
          <Right>
            <Badge style={{ backgroundColor: 'black' }}>
              <Text style={{ color: 'white' }}>{Store.UnReadNotificationFromStore}</Text>
            </Badge>
          </Right>
        ) : <Fragment />}
      </ListItem>
    )
  }

  render () {
    const { sideNavigation: { items }, handleLogout } = this.props
    const data = drawerItems(items)
    _getNotificationUnRead(() => {
    // console.log( "VAlue in Event Drawer : ",Store.UnReadNotificationFromStore);
    });

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Container>
          <View style={styles.container}>
            <View>
              { data.map(this.renderItem) }
            </View>
            { !this.props.offline ? (
              <View>
                <ListItem
                  button
                  noBorder
                  onPress={this.handleMyAccount}
                >
                  <Left>
                    <Icon name='md-person' style={{ fontSize: 30, width: 36, color: this.props.iconColor }} />
                    <Text style={styles.text}>
                  My Profile
                    </Text>
                  </Left>
                </ListItem>
                <ListItem
                  button
                  noBorder
                  onPress={this.handleAttendeeEvents}
                >
                  <Left>
                    <Icon name='md-arrow-back' style={{ fontSize: 30, width: 36, color: this.props.iconColor }} />
                    <Text style={styles.text}>
                  All Events
                    </Text>
                  </Left>
                </ListItem>
                <ListItem
                  button
                  noBorder
                  onPress={handleLogout}
                >
                  <Left>
                    <Icon name='md-exit' style={{ fontSize: 30, width: 36, color: this.props.iconColor }} />
                    <Text style={styles.text}>
                  Logout
                    </Text>
                  </Left>
                </ListItem>
              </View>
            ) : <Fragment />}
          </View>
        </Container>
      </SafeAreaView>

    )
  }
}

const styles = StyleSheet.create({
  text: {
    fontWeight: '400',
    fontSize: 18,
    marginLeft: 20
  },
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  }
})

export default DrawerContent
