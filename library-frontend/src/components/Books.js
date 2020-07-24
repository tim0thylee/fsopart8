import React, {useState, useEffect } from 'react'
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const result = useQuery(ALL_BOOKS)
  const [genres, setGenres] = useState([])
  const [filterGenre, setFilterGenre] = useState('all books')

  useEffect(() => {
    if (result.data) {
      const map = {}
      const uniqueGenres = []
      result.data.allBooks.forEach(book => {
        book.genres.forEach(genre => {
          if (!map[genre]) {
            map[genre] = true
            uniqueGenres.push(genre)
          }
        })
      })
      setGenres(uniqueGenres)
    }
  }, [result])

  if (!props.show) {
    return null
  }

  if (result.loading ) {
    return <div>loading...</div>
  }
 
  return (
    <div>
      <h2>books</h2>
      <h3>in genre {filterGenre}</h3>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {result.data.allBooks
            .map(a =>{
              let inFilter = false
              a.genres.forEach(genre => {
                if (genre === filterGenre) {
                  inFilter = true
                }
              })
              if (filterGenre === 'all books') {
                inFilter = true
              }
              if (inFilter) {
                return <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
              }
            }
          )}
        </tbody>
      </table>
      {genres.map(genre => 
        <button onClick={() => setFilterGenre(genre)} key={genre}>{genre}</button>
      )}
      <button onClick={() => setFilterGenre('all books')}>all books</button>
    </div>
  )
}

export default Books