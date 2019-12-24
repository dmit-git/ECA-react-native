import React, { Component } from 'react'
import last from 'lodash/last'
import { FlatList } from 'react-native'
import { ListItem, Left, Thumbnail, Icon, Body, Text } from 'native-base'
import { Actions } from 'react-native-router-flux'

class GroupDirectory extends Component {
  state = {
    refreshing: this.props.loading,
    attendees: this.props.attendees,
    page: -1
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.attendees.length > 0 && nextProps.page > prevState.page) {
      const lastAttendee = last(prevState.attendees)
      if (lastAttendee && lastAttendee.id === last(nextProps.attendees).id) return { refreshing: nextProps.loading }
      return {
        page: nextProps.page,
        refreshing: nextProps.loading,
        attendees: prevState.attendees.concat(nextProps.attendees)
      }
    }
    return { refreshing: nextProps.loading }
  }

  keyExtractor = (item, index) => String(item.id)

  handleClick = (id) => () => {
    Actions.push('attendeeDetail', { id })
  }

  handleNextPage = () => {
    if (this.state.attendees.length < this.props.pageInfo.total_count) this.props.handleNextPage()
  }

  renderItem = ({ item }) => (
    <ListItem button onPress={this.handleClick(item.id)} thumbnail last>
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

export default GroupDirectory
