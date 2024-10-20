import { useState } from 'react'
import './App.css'
import Navbar from './Components/Navbar'
import Weather from './Components/Weather'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar/>
      <Weather/>
    </>
  )
}

export default App
