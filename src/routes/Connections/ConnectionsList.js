import React, { Component } from 'react'
import last from 'lodash/last'
import { FlatList } from 'react-native'
import { ListItem, Left, Thumbnail, Icon, Body, Text } from 'native-base'
import { Actions } from 'react-native-router-flux'
import NoConnections from '../../components/Networking/NoConnections';

class ConnectionsList extends Component {
  state = {
    refreshing: this.props.loading,
    attendees: this.props.attendees,
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.attendees.length > 0) {
      return {
        refreshing: nextProps.loading,
        attendees: nextProps.attendees,
      }
    }
    return { refreshing: nextProps.loading, };
  }

  keyExtractor = (item, index) => `${item.id}-${index}`

  handleClickAttendee = (id) => () => {
    Actions.push('attendeeDetail', { id })
  }

  renderItem = ({ item }) => (
    <ListItem button onPress={this.handleClickAttendee(item.id)} thumbnail last>
      <Left>
        {item.avatar_url ? (
          <Thumbnail square source={{ uri: item.avatar_url }} />
        ) : (
          <Icon name='md-contact' />
        )}
      </Left>
      <Body>
        <Text>{`${item.first_name} ${item.last_name}`}</Text>
        <Text note>{item.email}</Text>
      </Body>
    </ListItem>
  )

  render () {
    const { attendees, refreshing } = this.state;
    const { onShowConnect } = this.props;
    if( attendees.length === 0 ){
      return <NoConnections onShowConnect={onShowConnect} />;
    }

    return (
      <FlatList
        keyExtractor={this.keyExtractor}
        data={attendees}
        initialNumToRender={10}
        refreshing={refreshing}
        renderItem={this.renderItem}
      />
    )
  }
}

export default ConnectionsList
