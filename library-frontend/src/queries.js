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
    published
    genres
  }
}
`

export const ALL_BOOKS = gql`
query {
  allBooks{
    title
    author {
      name
    }
    published
    genres
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
export const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password){
    value
  }
}
`

export const BOOKS_BY_GENRE = gql`
query booksByGenre($genre: String!) {
  allBooks(genre: $genre) {
    title
    author {
      name
    }
    published
  }
}
`

export const USER_INFO = gql`
query {
  me {
    username
    favoriteGenre
  }
}
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      published
      genres
      id
    }
  }
`