import { gql } from '@apollo/client';

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    bookCount
    born
  }
}
`

export const ADD_BOOK = gql`
mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
    title
    author
    published
    genres
  }
}
`

export const ALL_BOOKS = gql`
query {
  allBooks {
    title
    author
    published
  }
}
`

export const EDIT_BIRTH_YEAR = gql`
mutation changeBirthYear($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
        name
        born
        id
    }
}
`