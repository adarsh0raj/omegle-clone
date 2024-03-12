import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './components/Home'
import { Room } from './components/Room'
import { NotFound } from './components/NotFound'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="room" element={<Room />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App