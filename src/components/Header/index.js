import React, { Component} from 'react'
import { inject, observer } from 'mobx-react'
// import { StyleProvider } from 'native-base'
// import getTheme from '../../native-base-theme/components'
import StyledHeader from './Header'

@inject('eventStore')
@observer
class ThemedHeader extends Component {
  render () {
    return (
      // <StyleProvider style={getTheme(this.props.eventStore.theme)}>
        <StyledHeader {...this.props} />
      // </StyleProvider>
    )
  }
}

export default ThemedHeader
