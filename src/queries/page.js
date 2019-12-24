import gql from 'graphql-tag'

export const parsePage = page => ({
  ...page,
  body: JSON.parse(page.body || '{}')
})

export const PAGE = gql`
  query page($id: Uint) {
    page(id: $id) {
      id
      name
      body
      created_at
      updated_at
    }
  }
`
