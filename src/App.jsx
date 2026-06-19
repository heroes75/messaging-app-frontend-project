import { useEffect, useState } from 'react'
import './App.css'
import socket from './socket'

function App() {

  useEffect(() => {
    socket.connect()
  })

  return (
    <>
       <h1>Our First Test</h1>;
    </>
  )
}

export default App
