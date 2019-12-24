import React, { Component } from 'react'
import { StyleProvider } from 'native-base'
import { inject, observer } from 'mobx-react'
import getTheme from '../../native-base-theme/components'
import Account from './Account'

@inject('eventStore')
@observer
class Account extends Component {
  render () {
    return (
      <StyleProvider style={getTheme(this.props.eventStore.theme)}>
        <Account />
      </StyleProvider>
    )
  }
}

export default Account
