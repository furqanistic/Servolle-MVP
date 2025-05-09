import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/Auth/AuthPage'
import ConnectPage from './pages/Connect/ConnectPage'
import HistoryPage from './pages/History/HistoryPage'
import HomePage from './pages/Home/HomePage'
import ProfilePage from './pages/Profile/ProfilePage'
import SettingsPage from './pages/Settings/SettingsPage'
import VideoViewPage from './pages/Video/VideoViewPage'

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position='top-center' />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='login' element={<AuthPage />} />
        <Route path='signup' element={<AuthPage />} />
        <Route path='/'>
          <Route path='home' element={<HomePage />} />
          <Route path='video/:id' element={<VideoViewPage />} />
          <Route path='connect' element={<ConnectPage />} />
          <Route path='history' element={<HistoryPage />} />
          <Route path='profile' element={<ProfilePage />} />
          <Route path='settings' element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
