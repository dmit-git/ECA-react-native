import React, { Component } from 'react'
import get from 'lodash/get'
import throttle from 'lodash/throttle'
import GroupDirectory from './GroupDirectory'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

const ATTENDEES_PER_PAGE = 10

const GROUP_ATTENDEES = gql`
  query groupAttendees($group_id: Uint, $offset: Uint) {
    groupAttendees(group_id: $group_id, offset: $offset) {
      nodes {
        id
        email
        avatar_url
        first_name
        last_name
        has_chat_user
      }
      page_info {
        has_next_page
        total_count
      }
    }
  }
`

class GroupDirectoryContainer extends Component {
  state = {
    page: 0
  }

  handleNextPage = throttle(() => {
    this.setState({ page: this.state.page + 1 })
  }, 500, { leading: true })

  render () {
    const { id } = this.props
    const { page } = this.state
    return (
      <Query
        query={GROUP_ATTENDEES}
        fetchPolicy='cache-and-network'
        variables={{ group_id: id, offset: page * ATTENDEES_PER_PAGE }}>
        {({ loading, error, data, refetch }) => {
          const attendees = get(data, ['groupAttendees', 'nodes']) || []
          const pageInfo = get(data, ['groupAttendees', 'page_info']) || { has_next_page: false, total_count: 0 }
          return (
            <GroupDirectory
              handleNextPage={this.handleNextPage}
              groupID={id}
              attendees={attendees}
              pageInfo={pageInfo}
              page={page}
            />
          )
        }}
      </Query>
    )
  }
}

export default GroupDirectoryContainer
