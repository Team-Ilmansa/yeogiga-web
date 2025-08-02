import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import KakaoRedirect from './components/sign-in/KakaoRedirect'
import NaverRedirect from './components/sign-in/NaverRedirect'
import { useEffect } from 'react'
import { setUpInterceptors } from './apis/api'
import MyPage from './pages/MyPage'
import Participation from './pages/Participation'
import Dashboard from './pages/Dashboard'
import ConfirmCalendar from './pages/ConfirmCalendar'
import TripCalendar from './pages/TripCalendar'
import ProtectedRoute from './components/common/ProtectedRoute'
import UpdateCalendar from './pages/UpdateCalendar'
import CreateNotices from './components/notice/CreateNotices'

const App = () => {
  return (
    <div className='flex min-h-screen justify-center overflow-auto bg-gray-100'>
      <div className='flex w-4xl bg-white'>
        <Router>
          <Routes>
            {/* 보호되지 않는 공개 라우트 */}
            <Route path='signin' element={<SignIn />} />
            <Route path='signup' element={<SignUp />} />
            <Route path='oauth/kakao/callback' element={<KakaoRedirect />} />
            <Route path='oauth/naver/callback' element={<NaverRedirect />} />

            {/* 보호된 비공개 라우트 */}
            <Route element={<ProtectedRoute />}>
              <Route path='/' element={<Home />} />
              <Route path='mypage' element={<MyPage />} />
              <Route path='trip/:tripId'>
                <Route index element={<Dashboard />} />
                <Route path='calendar' element={<TripCalendar />} />
                <Route path='update' element={<UpdateCalendar />} />
                <Route path='confirmation' element={<ConfirmCalendar />} />
                <Route path='participation' element={<Participation />} />
                {/* TODO: 추후 Notice 페이지와 결합 */}
                <Route path='post/notice' element={<CreateNotices />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </div>
    </div>
  )
}

export default App
