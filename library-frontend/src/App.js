
import React, { useState, useEffect } from 'react'
import { useApolloClient, useSubscription, useQuery } from '@apollo/client';
import { BOOK_ADDED, ALL_BOOKS, USER_INFO } from './queries'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommendations from './components/Recommendations'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => 
      set.map(p => p.id).includes(object.id)

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
  
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks : dataInStore.allBooks.concat(addedBook) }
      })
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData}) => {
      const addedBook = subscriptionData.data.bookAdded
      updateCacheWith(addedBook)
    }
  })
  
  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('login')
  }
 
  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {!localStorage.getItem('user-token') ? <button onClick={() => setPage('login')}>login</button> : null}
        {localStorage.getItem('user-token') ? <button onClick={() => setPage('add')}>add book</button> : null}
        {localStorage.getItem('user-token') ? <button onClick={() => setPage('recommend')}>recommend</button> : null}
        {localStorage.getItem('user-token') ? <button onClick={logout}>logout</button> : null}
      </div>

      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
      />

      <Recommendations
        show={page === 'recommend'}
      />

      {!localStorage.getItem('user-token') ? 
        <Login
          show={page === 'login'}
          setToken={setToken}
        /> : null
      }

    </div>
  )
}

export default App