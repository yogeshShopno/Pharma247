import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const Protected = (props) => {
  const [token, setToken] = useState('')
  const history = useHistory()
  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) {
      return history.push('/')
    }
    setToken(token)
  }, [])
  if (!token) {
    return <p>Loading...</p>
  }
  return (
    <> {props.children}</>
  )
}

export default Protected