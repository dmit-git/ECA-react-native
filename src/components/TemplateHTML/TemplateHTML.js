import React, { Component} from 'react'
import mustache from 'mustache'
import { inject, observer } from 'mobx-react'
import HTMLView from 'react-native-htmlview'

@inject('eventStore', 'authStore')
@observer
class TemplateHTML extends Component {
  render () {
    const { value, htmlProps = {} } = this.props
    let attendeeMetadata = this.props.eventStore.attendeeMetadata || {}
    let clientMetadata = this.props.authStore.profile.client_metadata || {}
    const data = { ...this.props.authStore.profile, ...clientMetadata, ...attendeeMetadata }
    const result = mustache.render(value, data)
    return (
      <HTMLView {...htmlProps} value={result} />
    )
  }
}

export default TemplateHTML
