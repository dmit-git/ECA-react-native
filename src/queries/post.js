import gql from 'graphql-tag'

export const POSTS = gql`
  query posts($event_id: Uint, $offset: Uint, $search_query: String!) {
    posts(event_id: $event_id, offset: $offset, search_query:$search_query) {
      nodes {
        id
        attendee {
          id
          email
          first_name
          last_name
          avatar_url
        }
        body
        likes
        created_at
        comments {
          nodes {
            id
          }
        }
        attendees_who_liked {
          nodes {
            id
          }
          page_info {
            total_count
          }
        }
        media {
          nodes {
            id
            name
            src
            mime_type
          }
        }
      }
      page_info {
        total_count
        has_next_page
      }
    }
  }
`

export const POST = gql`
  query post($id: Uint!) {
    post(id: $id) {
      id
      attendee {
        id
        email
        first_name
        last_name
      }
      body
      likes
      comments {
        nodes {
          id
          body
          attendee {
            avatar_url
            id
            email
            first_name
            last_name
          }
          created_at
        }
      }
      attendees_who_liked {
          nodes {
            id
          }
          page_info {
            total_count
          }
        }
      media {
        nodes {
          id
          name
          src
          mime_type
        }
      }
      created_at
    }
  }
`

export const POST_LIKES = gql`
  query post($id: Uint!) {
    post(id: $id) {
      id
      attendee {
        id
        email
        first_name
        last_name
      }
      attendees_who_liked {
          nodes {
            id
            avatar_url
            first_name
            last_name
          }
          page_info {
            total_count
          }
        }
    }
  }
`
