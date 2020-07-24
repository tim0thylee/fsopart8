
import React, { useState } from 'react'
import { useApolloClient } from '@apollo/client';
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  
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