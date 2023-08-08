import { useState } from 'react'
import { ethers } from 'ethers'
import './App.css'

function App() {
  const status = {
    NOT_CONNECTED: "Not connected",
    CONNECTED: "Connected",
    ERROR: "Error",
    WAITING_SIGNATURE: "Waiting signature",
    LOGIN: "Waiting server login response",
  }

  const [connection, setConnection] = useState(status.NOT_CONNECTED)

  console.log(localStorage.getItem('token'));

  const login = async () => {
    // Check if Metamask is installed
    if (typeof window.ethereum === 'undefined')
      return setConnection(status.ERROR)
    setConnection(status.WAITING_SIGNATURE)
    // Connect Metamask
    const provider = new ethers.BrowserProvider(window.ethereum)
    // Get signer
    const signer = await provider.getSigner()
    // Sing message
    const signature = await signer.signMessage('Hello world')
    console.log({ signature })
    setConnection(status.LOGIN)
    // Send signature to server
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ signature, address: await signer.getAddress() })
    })
    const data = await response.json()
    localStorage.setItem('token', data.token)
    setConnection(status.CONNECTED)
  }

  const deploy = async () => {
    // Check if Metamask is installed
    if (typeof window.ethereum === 'undefined')
      return setConnection(status.ERROR)
    setConnection(status.WAITING_SIGNATURE)
    // Connect Metamask
    const provider = new ethers.BrowserProvider(window.ethereum)
    // Get signer
    const signer = await provider.getSigner()
    // Sing message
    const signature = await signer.signMessage('Hello world')
    console.log({ signature })
    setConnection(status.LOGIN)
    // Send deploy request to server
    const response = await fetch('http://localhost:3001/deploy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ signature, address: await signer.getAddress() })
    })
    const data = await response.json()
    // Catch error
    if(data.error) {
      setConnection(status.ERROR)
      if(data.message === 'invalid token') {
        localStorage.removeItem('token')
        setConnection(status.NOT_CONNECTED)
      }
    }
    console.log({ data })
  }

  return (
    <>
      <h1>Simple web3 login</h1>
      <div className="card">
        <button onClick={login} className='btn'>
          Login
        </button>
        <button onClick={deploy} className='btn'>
          Deploy
        </button>
        <p>
          <code>{connection}</code>
        </p>
      </div>
      <p className="read-the-docs">
        aqui pondre algo cuando se me ocurra
      </p>
    </>
  )
}

export default App
