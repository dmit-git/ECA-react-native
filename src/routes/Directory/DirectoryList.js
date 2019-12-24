import React, { Component } from 'react'
import last from 'lodash/last'
import { FlatList } from 'react-native'
import { ListItem, Left, Thumbnail, Icon, Body, Text } from 'native-base'
import { Actions } from 'react-native-router-flux'

class DirectoryList extends Component {
  state = {
    refreshing: this.props.loading,
    attendees: this.props.attendees,
    page: -1
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const defaultReturn = {
      page: nextProps.page,
      refreshing: nextProps.loading,
      attendees: nextProps.attendees
    };
    const loadingReturn = { refreshing: nextProps.loading };

    if( nextProps.loading ){
      return loadingReturn;
    }
    if( nextProps.isSearch ){
      return defaultReturn;
    }
    if (nextProps.attendees.length > 0 && nextProps.page > prevState.page) {
      const lastAttendee = last(prevState.attendees)
      if (lastAttendee && lastAttendee.id === last(nextProps.attendees).id) return { refreshing: nextProps.loading }
      return {
        page: nextProps.page,
        refreshing: nextProps.loading,
        attendees: prevState.attendees.concat(nextProps.attendees)
      }
    }
    if( prevState.page > nextProps.page && nextProps.page === 0 ){
      return defaultReturn;
    }
    return loadingReturn;
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

  handleNextPage = () => {
    if (this.state.attendees.length < this.props.pageInfo.total_count) this.props.handleNextPage()
  }

  render () {
    const { attendees, refreshing } = this.state
    return (
      <FlatList
        keyExtractor={this.keyExtractor}
        data={attendees}
        initialNumToRender={10}
        refreshing={refreshing}
        onEndReached={this.handleNextPage}
        renderItem={this.renderItem}
      />
    )
  }
}

export default DirectoryList
