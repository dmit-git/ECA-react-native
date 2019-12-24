import React, { Component } from 'react'
import { StyleProvider } from 'native-base'
import { inject, observer } from 'mobx-react'
import getTheme from '../../native-base-theme/components'
import AgendaItemModal from './AgendaItemModal'

import Orientation from 'react-native-orientation';
@inject('eventStore')
@observer
class Container extends Component {
  componentDidMount() {
    Orientation.lockToPortrait();
  }
  render () {        
    const eventTheme = getTheme(this.props.eventStore.theme)
    return (        
      <AgendaItemModal visible={this.props.visible} agendaItem={this.props.agendaItem} theme={eventTheme} closeModal={this.props.closeModal}/>        
    )
  }
}

export default Container
