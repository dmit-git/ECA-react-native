import React, { Component } from 'react'
import gql from 'graphql-tag'
import get from 'lodash/get'
import { Query } from 'react-apollo'
import analyticsStore from '../../stores/analyticsStore'
import DirectoryList from './DirectoryList'

const EVENT_ATTENDEES_DIRECTORY = gql`
  query eventAttendeesDirectory($event_id: Uint, $search_term: String) {
    eventAttendeesDirectory(event_id: $event_id, search_term: $search_term) {
      nodes {
        id
        email
        avatar_url
        first_name
        last_name
        has_chat_user
      }
      page_info {
        total_count
        has_next_page
      }
    }
  }
`

class DirectoryContainer extends Component {
  componentDidMount () {
    analyticsStore.sendScreenView('Directory')
  }
  render () {
    const { eventID, searchTerm, isSearch, page, handleNextPage } = this.props;
    return (
      <Query
        query={EVENT_ATTENDEES_DIRECTORY}
        fetchPolicy='cache-and-network'
        variables={{ event_id: eventID, search_term: searchTerm }}>
        {({ loading, error, data, refetch }) => {
          if (loading) return null;
          let attendees = get(data, ['eventAttendeesDirectory', 'nodes']) || []
          let pageInfo = get(data, ['eventAttendeesDirectory', 'page_info']) || { has_next_page: false, total_count: 0 }
          return (
            <DirectoryList
              loading={loading}
              error={error}
              attendees={attendees}
              pageInfo={pageInfo}
              isSearch={isSearch}
              handleNextPage={handleNextPage}
              page={page}
            />
          )
        }}
      </Query>
    )
  }
}

export default DirectoryContainer
