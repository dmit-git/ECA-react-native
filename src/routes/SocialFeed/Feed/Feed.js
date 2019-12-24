import React, { Component, Fragment } from 'react'
import last from 'lodash/last'
import { Actions } from 'react-native-router-flux'
import { FlatList, TextInput, TouchableOpacity } from 'react-native'
import { Container, Icon, Button, Text, View } from 'native-base'

import Header from '../../../components/Header'
import PostCard from '../../../components/PostCard'

export default class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: this.props.loading,
      page: -1,
      posts: [],
      showMore: false,
      searchData: this.props.searchData || '',
      unmounted: false,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.posts.length > 0 && nextProps.page !== prevState.page) {
      const lastPost = last(prevState.posts)
      if (lastPost && lastPost.id === last(nextProps.posts).id) return { refreshing: nextProps.loading, showMore: false }
      const posts = prevState.posts.concat(nextProps.posts)
      // const posts = nextProps.posts
      if (nextProps.newPost && posts[0].id !== nextProps.newPost.id) posts.unshift(nextProps.newPost)
      return {
        showMore: false,
        page: nextProps.page,
        refreshing: nextProps.loading,
        searchData: nextProps.searchData,
        posts
      }
    }
    return { refreshing: nextProps.loading, showMore: false }
  }

  handleClick = ({ id }) => () => {
    Actions.push('post', { id })
  }

  keyExtractor = (item, index) => `${item.id}-${index}`

  handleMediaClick = (media) => () => {
    Actions.push('mediaViewer', { media })
  }

  handleHashtagClick = hashtag => {
    // this.setState({ searchData: hashtag });
    this.props.getSearch(hashtag);
  }

  handleLinkClick = (uri) => {
    console.log(uri)
    return Actions.push('webViewStack', { uri })
  }

  renderItem = ({ item }) => {
    if (!item) return <Fragment key={String(Math.random())} />
    const isMine = this.props.email === item.attendee.email
    return (
      <PostCard
        myID={this.props.myID}
        key={String(item.id)}
        post={item}
        handleMediaClick={this.handleMediaClick(item.media.nodes)}
        isMine={isMine}
        refetch={this.props.handleRefetch}
        handleCommentClick={this.handleClick(item)}
        handleHashtagClick={this.handleHashtagClick}
        showButtons
        handleLinkClick={this.handleLinkClick}
      />
    )
  }

  handleNextPage = () => {
    if (this.state.posts.length < this.props.pageInfo.total_count) {
      this.props.handleNextPage()
    }
  }

  handleShowMoreButton = () => {
    if (this.state.refreshing) return false
    this.setState({ showMore: true })
  }

  handleTextChange = (searchData) => {
    const { unmounted } = this.state;
    if( !unmounted ){
      this.setState({ searchData });
      this.setSearchTimeout();
      this.props.showSearchIcon();
    }
  }

  setSearchTimeout = () => {
    this.clearSearchTimeout();
    this.searchTimer = setTimeout(() => {
      const { refreshing, unmounted, searchData } = this.state;
      if (!refreshing && !unmounted && searchData) {
        this.search();
      }
    }, 800)
  }

  clearSearchTimeout = () => {
    clearTimeout(this.searchTimer);
    this.setTimeout = 0;
  }

  search = () => {
    const { getSearch } = this.props;
    const { searchData } = this.state;
    console.log("SEARCH");
    console.log(searchData);
    getSearch(searchData);
  }

  clearSearch = () => {
    this.clearSearchTimeout();
    this.props.clearSearch();
  }

  render () {
    const { posts, showMore } = this.state
    const { handleRefetch, refreshCounter, pageInfo, getSearch, showClearIcon } = this.props;
    const icon = showClearIcon ? 'close' : 'search';
    const iconAction = showClearIcon ? this.clearSearch : () => getSearch(this.state.searchData);
    return (
      <Container>
        <Header
          headerTitle={'Social Feed'}
          renderLeft={(
            <Button transparent onPress={Actions.drawerOpen}>
              <Icon name='md-menu' />
            </Button>
          )}
          renderRight={(
            <Button transparent onPress={Actions.newPostStack}>
              <Icon name='md-add' />
            </Button>
          )}
        />
        <View style={{ margin: 8, flexDirection: 'row' }}>

          <TextInput
            style={{ height: 40, borderColor: 'gray', borderBottomWidth: 0.5, padding: 4, width: '90%' }}
            onChangeText={this.handleTextChange}
            value={this.state.searchData}
            placeholder=" Search"
            selectionColor="black"
          />

          <TouchableOpacity style={{ margin: 10 }} onPress={iconAction}>
            <Icon name={icon} style={{ fontSize: 25, color: 'gray' }} />
          </TouchableOpacity>

        </View>
        <FlatList
          keyExtractor={this.keyExtractor}
          initialNumToRender={10}
          data={posts}
          onEndReached={this.handleNextPage}
          onRefresh={handleRefetch}
          refreshing={this.state.refreshing}
          renderItem={this.renderItem.bind(this)}
          extraData={refreshCounter}
        />
        {showMore && (posts.length < pageInfo.total_count) ? (
          <Button full large dark onPress={this.handleNextPage}>
            <Text>Load more</Text>
          </Button>
        ) : <Fragment />}
      </Container>
    )
  }
}
