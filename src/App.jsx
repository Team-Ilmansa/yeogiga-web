import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import KakaoRedirect from './components/sign-in/KakaoRedirect'
import NaverRedirect from './components/sign-in/NaverRedirect'
import { useEffect } from 'react'
import { setUpInterceptors } from './apis/api'
import MyPage from './pages/MyPage'
import Trip from './pages/Trip'
import Participation from './pages/Participation'
import Dashboard from './pages/dashboard'

const App = () => {
  return (
    <div className='flex min-h-screen justify-center overflow-auto bg-gray-100'>
      <div className='flex w-4xl bg-white'>
        <Router>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='signin' element={<SignIn />} />
            <Route path='signup' element={<SignUp />} />
            <Route path='oauth/kakao/callback' element={<KakaoRedirect />} />
            <Route path='oauth/naver/callback' element={<NaverRedirect />} />
            <Route path='mypage' element={<MyPage />} />
            <Route path='trip/:tripId' element={<Trip />} />
            <Route path='trip/:tripId'>
              <Route index element={<Trip />} />
              <Route path='participation' element={<Participation />} />
              <Route path='dashboard' element={<Dashboard />} />
            </Route>
          </Routes>
        </Router>
      </div>
    </div>
  )
}

export default App
