import React, { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client';
import { ALL_AUTHORS, ADD_BOOK, BOOKS_BY_GENRE, USER_INFO } from '../queries'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuhtor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [userGenre, setUserGenre] = useState('')
  const [genres, setGenres] = useState([])
  const userInfo = useQuery(USER_INFO)

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.me) {
      setUserGenre(userInfo.data.me.favoriteGenre)
  }
  }, [userInfo])


  const [ createBook ] = useMutation(ADD_BOOK, {refetchQueries: [{query:ALL_AUTHORS}, {query: BOOKS_BY_GENRE, variables: {genre: userGenre}}]})

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    
    createBook({ variables: {title, author, published: parseInt(published, 10), genres} })
    console.log('add book...')

    setTitle('')
    setPublished('')
    setAuhtor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook