  
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client';
import { ALL_AUTHORS, EDIT_BIRTH_YEAR } from '../queries'


const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const result = useQuery(ALL_AUTHORS)
  const [editAuthor] = useMutation(EDIT_BIRTH_YEAR, {refetchQueries: [{query: ALL_AUTHORS}]})

  const updateInfo = event => {
    event.preventDefault()
    let intBorn =  parseInt(born, 10)
    editAuthor({variables: {name, setBornTo: intBorn}})
    setBorn('')
  }

  useEffect(()=> {
    if(result.data) {
      setName(result.data.allAuthors[0].name)
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
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {result.data.allAuthors.map(a =>
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
        <form onSubmit={updateInfo}>
        <select value={name} onChange={e => setName(e.target.value)}>
            {result.data.allAuthors.map(a => {
                return <option value={a.name}>{a.name}</option>
              }
            )}
        </select>
        <div>
        born: <input type="number" value={born} onChange={e => setBorn(e.target.value)}/>
        </div>
        <button type="submit"> update author</button>
        </form>
    </div>
  )
}

export default Authors
