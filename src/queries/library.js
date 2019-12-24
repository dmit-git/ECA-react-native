import gql from 'graphql-tag'

export const LIBRARY = gql`
  query library($id: Uint) {
    library(id: $id) {
      id
      name
      description
      sort_order
      media {
        nodes {
          id
          name
          src
          type
          mime_type
        }
      }
    }
  }
`
