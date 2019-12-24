import React, { Component } from 'react'
import { StyleProvider, Container, Button, Icon } from 'native-base'
import { Actions } from 'react-native-router-flux'
import throttle from 'lodash/throttle'
import { inject, observer } from 'mobx-react'
import getTheme from '../../native-base-theme/components'
import Header from '../../components/Header'
import Directory from './Directory'
import SearchForm from './SearchForm'
import Orientation from 'react-native-orientation';
@inject('eventStore')
@observer
class DirectoryContainer extends Component {
  state = {
    searchTerm: null,
    isSearch: false,
    page: 0
  }
  componentDidMount() {
    Orientation.lockToPortrait();
  }

  handleSearch = (val) => {
    // if (!val || val.length === 0) return this.setState({ searchTerm: null, isSearch: true, page: 0 })
    this.setState({ searchTerm: val, isSearch: true, page: 0 })
  }

  handleNextPage = throttle(() => {
    this.setState({ page: this.state.page + 1, isSearch: false })
  }, 500, { leading: true })

  render () {
    const { searchTerm, isSearch, page } = this.state
    const event_id = this.props.eventStore.event.id
    return (
      <StyleProvider style={getTheme(this.props.eventStore.theme)}>
        <Container>
          <Header
            headerTitle='Directory'
            renderLeft={(
              <Button transparent onPress={Actions.pop}>
                <Icon name='md-arrow-back' />
              </Button>
            )}
          />
          <SearchForm searchTerm={this.state.searchTerm} handleSearch={this.handleSearch} />
          <Directory
            searchTerm={searchTerm}
            isSearch={isSearch}
            page={page}
            handleNextPage={this.handleNextPage}
            eventID={event_id}
          />
        </Container>
      </StyleProvider>
    )
  }
}

export default DirectoryContainer
