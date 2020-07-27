import React, { useEffect, useState } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client';
import {BOOKS_BY_GENRE, USER_INFO } from '../queries'

const Recommend = props => {
    const [getBooks, bookResult] = useLazyQuery(BOOKS_BY_GENRE)
    const [books, setBooks] = useState([])
    const userInfo = useQuery(USER_INFO)

    useEffect(() => {
        if (userInfo && userInfo.data && userInfo.data.me) {
            getBooks({ variables: {genre: userInfo.data.me.favoriteGenre}})
        }
    }, [userInfo])

    useEffect(() => {
        if(bookResult && bookResult.data) {
            setBooks(bookResult.data.allBooks)
        }
    }, [bookResult])

    if (!props.show) {
        return null
    }

    if (bookResult.loading || userInfo.loading) {
        return "loading..."
    }
    console.log(books)
    console.log(userInfo)
    return (
        <div>
            <h2>recommendations</h2>
            <p>books in your favorite genre <b>{userInfo && userInfo.data && userInfo.data.me ? userInfo.data.me.favoriteGenre : null}</b></p>
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
                {books.map(a =>
                    <tr key={a.title}>
                        <td>{a.title}</td>
                        <td>{a.author.name}</td>
                        <td>{a.published}</td>
                    </tr>
                    )
                }
                </tbody>
            </table>
        </div>
    )
}

export default Recommend