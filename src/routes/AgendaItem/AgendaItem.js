import React, { PureComponent, Fragment } from 'react'
import moment from 'moment'
import { Actions } from 'react-native-router-flux'
import { Platform, Linking, StyleSheet, View } from 'react-native'
import { Content, ListItem, Text, Left, Body, Icon, Container, Button, Right } from 'native-base'
import Header from '../../components/Header'
import TemplateText from '../../components/TemplateText'
import analyticsStore from '../../stores/analyticsStore'
import HTMLView from 'react-native-htmlview';

const openGps = () => (location) => {
  const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q='
  const url = Platform.OS === 'ios' ? `${scheme}${location}` : `${scheme}(${location})`
  Linking.openURL(url)
}

export default class AgendaItem extends PureComponent {
  componentDidMount () {
    analyticsStore.sendScreenView(`Agenda Item - ${this.props.agendaItem.name}`)
  }

  render () {
    const { id, name, description, start_time, end_time, location } = this.props.agendaItem
    const date = moment(start_time, moment.ISO_8601)
    const endDate = moment(end_time, moment.ISO_8601)
    const locationHeight = (location.length / 2) + 15
    return (
      <Container>
        <Header
          headerTitle={name}
          renderLeft={(
            <Button transparent onPress={Actions.pop}>
              <Icon name='md-arrow-back' />
            </Button>
          )}
        />
        <Content>
          <ListItem icon last>
            <Left>
              <Icon name='md-time' />
            </Left>
            <Body>
              <Text>{date.format('dddd, MMMM D')}</Text>
            </Body>
            <Right>
              <Text note>{`${date.format('h:mm')} - ${endDate.format('h:mm a')}`}</Text>
            </Right>
          </ListItem>
          { location ? (
            <ListItem
              icon
              onClick={openGps(location)}
              style={{ height: locationHeight }}
            >
              <Left>
                <Icon name='md-map' />
              </Left>
              <Body style={{ height: locationHeight }}>
                {location.indexOf('{{') > -1 ? (
                  <TemplateText text={location} />
                ) : <Text style={styles.subHeader}>{location}</Text>}
              </Body>
            </ListItem>
          ) : <Fragment /> }
          {
            description.length>0 ? (
            <View style={styles.description}>
              <HTMLView
                  value={description}
              />
              {/*<TemplateText text={description} />*/}
            </View>
          ) : <Fragment /> }
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  description: {
    padding: 12
  }
})
