import React, { Component} from 'react'
import mustache from 'mustache'
import { inject, observer } from 'mobx-react'
import { Text } from 'native-base'

@inject('eventStore', 'authStore')
@observer
class TemplateText extends Component {
  render () {
    const { text, textProps = {}, maxLength } = this.props
    let attendeeMetadata = this.props.eventStore.attendeeMetadata || {}
    let clientMetadata = this.props.authStore.profile.client_metadata || {}
    const data = { ...this.props.authStore.profile, ...clientMetadata, ...attendeeMetadata }
    let result = mustache.render(text, data)
    if (maxLength && maxLength > 0 && result.length > maxLength) {
      result = result.slice(0, maxLength) + '...'
    }
    return (
      <Text {...textProps}>{result}</Text>
    )
  }
}

export default TemplateText
