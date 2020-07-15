const { ApolloServer, gql } = require('apollo-server')
const { v1: uuid } = require('uuid')

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

const typeDefs = gql`
  type Author {
    name: String!
    bookCount: Int!
    born: Int
  }
  type Book {
    title: String!
    published: Int!
    author: String!
    id: ID!
    genres: [String!]!
  }
  type Query {
    authorCount: Int!
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }
  type Mutation {
    addBook(
        title: String!
        author: String!
        published: Int!
        genres: [String!]!
    ) : Book
  }
`

const resolvers = {
  Query: {
      bookCount: () => books.length,
      authorCount: () => authors.length,
      allBooks: (root, args) => {
        const filteredBooks = []
        if (!args.author && !args.genre) {
            return books
        }
        if (args.genre) {
            books.forEach(book => {
                book.genres.forEach(genre => {
                    if (args.genre === genre) {
                        return filteredBooks.push(book)
                    }
                })
            })
        }
        if (args.author) {
            if (filteredBooks.length === 0 && !args.genre) {
                return books.filter(book => book.author === args.author)
            }
            return filteredBooks.filter(book => book.author === args.author)
        }
        return filteredBooks
      },
      allAuthors: () => {
        const authorBookCount = {}
        const authorBorn = {}
        const authorObjects = []
        authors.forEach(author => {
            authorBorn[author.name] = author.born
        })
        books.forEach(book => {
            if (!authorBookCount[book.author]){
                authorBookCount[book.author] = 1
            } else {
                authorBookCount[book.author]++
            }
        })
        for (key in authorBookCount) {
            authorObjects.push({
                name: key,
                bookCount: authorBookCount[key],
                born: authorBorn[key]
            })
        }
        return authorObjects
    }
  },
  Mutation: {
    addBook: (root, args) => {
        const book = { ...args, id: uuid()}
        let authorExists = false
        // concat data to book
        books = books.concat(book)
        authors.forEach(author => {
            if (author.name === args.author) {
                authorExists = true
            }
        })
        // if author dont exists, add to database
        if(!authorExists) {
            const newAuthor = {
                name: args.author,
                born: null,
                id: uuid()
            }
            authors.concat(newAuthor)
        }
        return book
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})