import React, { Component } from 'react'
import { Icon, Item, Input, Form } from 'native-base'

export default class SearchForm extends Component {
  state = {
    searchTerm: this.props.searchTerm
  }

  handleSetState = (name) => (val) => {
    this.setState({ [name]: val })
  }

  handleSearch = () => {
    this.props.handleSearch(this.state.searchTerm)
  }

  render () {
    return (
      <Form>
        <Item>
          <Icon active name='md-search' />
          <Input
            placeholder='Search'
            value={this.state.searchTerm}
            returnKeyLabel='Search'
            returnKeyType='search'
            onSubmitEditing={this.handleSearch}
            onChangeText={this.handleSetState('searchTerm')}
          />
        </Item>
      </Form>
    )
  }
}
