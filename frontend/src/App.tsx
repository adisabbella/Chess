import './App.css'
import LandingPage from '../components/LandingPage'
import Game from '../components/Game'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>}></Route>
        <Route path='/game' element={<Game/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
