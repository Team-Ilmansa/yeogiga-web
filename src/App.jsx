import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import KakaoRedirect from './components/sign-in/KakaoRedirect'
import NaverRedirect from './components/sign-in/NaverRedirect'
import MyPage from './pages/MyPage'
import Participation from './pages/Participation'
import Dashboard from './pages/Dashboard'
import ConfirmCalendar from './pages/ConfirmCalendar'
import TripCalendar from './pages/TripCalendar'
import ProtectedRoute from './components/common/ProtectedRoute'
import UpdateCalendar from './pages/UpdateCalendar'
import PastNotices from './components/notice/PastNotices'
import PlaceMap from './pages/PlaceMap'
import RestoreAccount from './pages/RestoreAccount'
import GuestSignUp from './components/sign-up/GuestSignUp'
import PlanningPlaceMap from './pages/PlanningPlaceMap'
import SettlementAdd from './pages/SettlementAdd'
import SettlementBook from './pages/SettlementBook'
import TripPlaceMap from './pages/TripPlaceMap'
import SettlementDetail from './pages/SettlementDetail'
import RallyMap from './pages/RallyMap'
import RallyPointViewer from './pages/RallyPointViewer'
import SettlementEdit from './pages/SettlementEdit'
import FindId from './pages/FindId'
import FindIdResult from './pages/FindIdResult'
import LandingPage from './pages/LandingPage'

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
            <Route path='signup/guest' element={<GuestSignUp />} />
            <Route path='invite/:tripId' element={<LandingPage />} />
            {/* TODO: 추후 페이지 변경 예정 */}
            <Route path='restore/account' element={<RestoreAccount />} />
            <Route path='user/help/id' element={<FindId />} />
            <Route path='user/help/id/result' element={<FindIdResult />} />
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
                {/**가계부 페이지 */}
                <Route path='settlementbook' element={<SettlementBook />} />
                {/** TODO: 정산내역 추가 페이지 경로 변경 예정 */}
                <Route path='settlement/add' element={<SettlementAdd />} />
                {/** 정산 내역 세부 조회 페이지 */}
                <Route
                  path='settlement/:settlementId'
                  element={<SettlementDetail />}
                />
                {/** 정산 내역 수정하기 페이지 */}
                <Route
                  path='/trip/:tripId/settlement/:settlementId/edit'
                  element={<SettlementEdit />}
                />

                {/* 지난 여행 전체보기 페이지 */}
                <Route path='past/notices' element={<PastNotices />} />
                <Route path='map' element={<TripPlaceMap />} />
                <Route path='map/:day' element={<PlaceMap />} />
                <Route path='map/plan/:day' element={<PlanningPlaceMap />} />
                <Route path='rally' element={<RallyMap />} />
                <Route path='rally-viewer' element={<RallyPointViewer />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </div>
    </div>
  )
}

export default App
