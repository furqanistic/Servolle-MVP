import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/Auth/AuthPage'
import HomePage from './pages/Home/HomePage'

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position='top-center' />
      <Routes>
        <Route path='/' element={<AuthPage />} />
        <Route path='auth' element={<AuthPage />} />
        <Route path='home' element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
