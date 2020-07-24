import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client';
import { LOGIN } from '../queries'

const Login = props => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [login, result] = useMutation(LOGIN, {
        onError: error => {
            console.log(error.graphQLErrors[0].mesage)
        }
    })

    const submit = e => {
        e.preventDefault()
        login({variables: {username, password}})
        props.setToken()
        setUsername('')
        setPassword('')
    }

    useEffect(() => {
        if (result.data){
            const token = result.data.login.value
            props.setToken(token)
            localStorage.setItem('user-token', token)
        }
    }, [result.data])

    if (!props.show) {
        return null
    }

    return (
        <form onSubmit={submit}>
            name: <input value={username} onChange={e => setUsername(e.target.value)}/>
            <br/>
            password: <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
            <br/>
            <button type='submit'>Login</button>
        </form>
    )
}

export default Login