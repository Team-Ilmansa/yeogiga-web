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

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='signin' element={<SignIn />} />
        <Route path='signup' element={<SignUp />} />
        <Route path='oauth/kakao/callback' element={<KakaoRedirect />} />
        <Route path='oauth/naver/callback' element={<NaverRedirect />} />
        <Route path='mypage' element={<MyPage />} />
        <Route path='trip/:tripId' element={<Trip />} />
      </Routes>
    </Router>
  )
}

export default App
