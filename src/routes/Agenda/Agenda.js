import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,  
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Agenda } from 'react-native-calendars'
import moment from 'moment'

import { Button, Container, Icon } from 'native-base'
import Header from '../../components/Header'
import AgendaItemButton from '../../components/AgendaItemButton'
import AgendaItemModal from '../../components/AgendaItemModal'
import TemplateText from '../../components/TemplateText'
import EmptyDate from './EmptyDate'

const calendarFormat = 'YYYY-MM-DD'

const sortDates = (d1, d2) => {
  if (d1.start_time._d > d2.start_time._d) return 1
  if (d1.start_time._d < d2.start_time._d) return -1
  return 0
}

export default class AgendaScreen extends Component {
  constructor (props) {
    super(props)
    const dayMoment = moment()
    this.state = {
      day: dayMoment.format(calendarFormat),
      items: this.formatDayItems(dayMoment),
      itemDetailIsVisible: false,
      currentModal: {},
    }
  }

  formatDayItems = (dayMoment) => {
    const { agenda } = this.props
    return agenda.reduce((final, item) => {
      const itemMoment = moment(item.start_time, moment.ISO_8601)
      if (!itemMoment.isSame(dayMoment, 'd')) return final
      const formattedDay = itemMoment.format(calendarFormat)
      if (!final[formattedDay]) final[formattedDay] = []
      final[formattedDay].push({
        ...item,
        start_time: moment(item.start_time, moment.ISO_8601),
        end_time: moment(item.end_time, moment.ISO_8601)
      })
      final[formattedDay].sort(sortDates)
      return final
    }, {})
  }

  handleShowDetail = (item) => () => {       
    this.setState({
      itemDetailIsVisible: true,
      currentModal: item,
    })    
  }

  handleCloseDetail = () => {
    this.setState({
      itemDetailIsVisible: false,
      currentModal: {},
    }) 
  }

  renderItem = (item) => {
    return (
      !item.name ? <View/> : <AgendaItemButton onPress={this.handleShowDetail(item)} theme={this.props.theme} agendaItem={item} />
    )
  }

  renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate} />
    )
  }

  rowHasChanged = (r1, r2) => {
    return r1.updated_at !== r2.updated_at
  }

  timeToString = (time) => {
    const date = new Date(time)
    return date.toISOString().split('T')[0]
  }

  handleDayPress = ({ dateString: day }) => {
    this.setState({
      day,
      items: this.formatDayItems(moment(day))
    })
  }

  render () {
    const { items } = this.state
    const { event, theme, agenda } = this.props
    const markedDates = agenda.reduce((final, item) => {
      const itemMoment = moment(item.start_time, moment.ISO_8601)
      const formattedDay = itemMoment.format(calendarFormat)
      final[formattedDay] = { marked: true }
      return final
    }, {})
    const startDate = moment(event.start_time, moment.ISO_8601)
    const endDate = moment(event.end_time, moment.ISO_8601)
    const futureScroll = Math.ceil(endDate.diff(startDate, 'months', true))
    return (
      <Container>
        <Header
          headerTitle={'Agenda'}
          renderLeft={(
            <Button transparent onPress={Actions.drawerOpen}>
              <Icon name='md-menu' />
            </Button>
          )}
        />
        <Agenda
          markedDates={markedDates}
          items={items}
          selected={moment().format(calendarFormat)}
          renderItem={this.renderItem}
          renderDay={() => null}
          pastScrollRange={6}
          futureScrollRange={futureScroll}
          onDayPress={this.handleDayPress}
          renderEmptyData={() => { return <EmptyDate /> }}
          renderEmptyDate={this.renderEmptyDate}
          rowHasChanged={this.rowHasChanged}
          minDate={startDate.format(calendarFormat)}
          maxDate={endDate.format(calendarFormat)}
          theme={{
            todayTextColor: theme.variables.brandPrimary,
            selectedDayBackgroundColor: theme.variables.brandPrimary,
            dotColor: theme.variables.brandPrimary,
            monthTextColor: theme.variables.brandPrimary,
            agendaDayTextColor: theme.variables.brandPrimary,
            agendaDayNumColor: theme.variables.brandPrimary,
            agendaTodayColor: theme.variables.brandPrimary,
            agendaKnobColor: theme.variables.brandPrimary
          }}
        />
        
        {this.state.itemDetailIsVisible ? <AgendaItemModal theme={this.props.theme} visible={this.state.itemDetailIsVisible} agendaItem={this.state.currentModal} closeModal={this.handleCloseDetail}/> : null}
        
      </Container>
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
