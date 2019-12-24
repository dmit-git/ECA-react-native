import React, { Component } from 'react'
import get from 'lodash/get'
import throttle from 'lodash/throttle'
import { Actions } from 'react-native-router-flux'
import { StyleProvider } from 'native-base'
import { Query } from 'react-apollo'
import { inject, observer } from 'mobx-react'
import getTheme from '../../../native-base-theme/components'
import Feed from './Feed'
import { POSTS } from '../../../queries/post'
import Orientation from 'react-native-orientation';

const POSTS_PER_PAGE = 10

@inject('eventStore', 'authStore', 'analyticsStore')
@observer
class FeedContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      page: 0,
      refreshCounter: 0,
      searchData: this.props.searchData || '',
      showClearIcon: this.props.showClearIcon || false,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {

    var searchData= "";
    if (nextProps.searchData) {
        searchData=nextProps.searchData;
    }
    if (nextProps.forceRefetch) {
      return {
        page: 0,
        refreshCounter: prevState.refreshCounter + 1,
        searchData: searchData,
      }
    }
   
    return null
  }
  
  componentDidMount() {
    Orientation.lockToPortrait();
    this.props.analyticsStore.sendScreenView('Social Feed')
  }

  handleNextPage = throttle(() => {
    this.setState({ page: this.state.page + 1 })
  }, 500, { leading: true })

  handleRefetch = (search, showClearIcon) => {
    setTimeout(() => {
      Actions.reset('feed', { forceRefetch: true, searchData: search, showClearIcon: showClearIcon });
    }, 200); 
  }

  getSearch = (search) => {
    this.updateSearch(search, true);
  }

  clearSearch = () => {
    this.updateSearch('', false);
  }

  updateSearch = (search, showClearIcon) => {
    this.setState(
      { searchData: search,
        showClearIcon: showClearIcon,
      },
      this.handleRefetch(search, showClearIcon)
    );
  }

  showSearchIcon = () => {
    this.setState({ showClearIcon: false });
  }

  render() {
    const { page, refreshCounter, showClearIcon } = this.state
    const { newPost } = this.props
    const myID = this.props.authStore.profile.id
    const email = this.props.authStore.profile.email
    return (
      <Query
        query={POSTS}
        fetchPolicy='network-only'
        variables={{ event_id: this.props.eventStore.event.id, offset: page * POSTS_PER_PAGE, search_query: this.state.searchData }}>
        {({ loading, error, data, refetch }) => {
          const posts = get(data, ['posts', 'nodes']) || []
          const pageInfo = get(data, ['posts', 'page_info']) || { has_next_page: false, total_count: 0 }
          return (
            <StyleProvider style={getTheme(this.props.eventStore.theme)}>
              <Feed
                loading={loading}
                error={error}
                eventID={this.props.eventStore.event.id}
                posts={posts}
                refreshCounter={refreshCounter}
                handleNextPage={this.handleNextPage}
                handleRefetch={this.handleRefetch}
                myID={myID}
                email={email}
                pageInfo={pageInfo}
                page={page}
                newPost={newPost}
                searchData={this.state.searchData}
                getSearch={this.getSearch}
                clearSearch={this.clearSearch}
                showSearchIcon={this.showSearchIcon}
                showClearIcon={showClearIcon}
              />
            </StyleProvider>
          )
        }}
      </Query>
    )
  }
}

export default FeedContainer
