import userInfoApi from '@/apis/users/userInfoApi'
import { useEffect, useState, useCallback, useRef } from 'react'
import HomeButton from '@/components/home/HomeButton'
import { ChevronRight } from 'lucide-react'
import ProfileCard from '@/components/mypage/ProfileCard'
import AccountSettings from '@/components/mypage/AccountSettings'
import ProfileModal from '@/components/mypage/ProfileModal'
import readTripByStatusApi from '@/apis/trip/readTripByStatusApi'
import AllTrip from '@/components/mypage/AllTrips'

const MyPage = () => {
  const [userInfo, setUserInfo] = useState([])
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [allTrips, setAllTrips] = useState([])
  const [allTripsPage, setAllTripsPage] = useState(0)
  const [hasMoreAllTrips, setHasMoreAllTrips] = useState(true)
  const hasMoreAllTripsRef = useRef(hasMoreAllTrips)
  hasMoreAllTripsRef.current = hasMoreAllTrips

  /**회원 정보 조회 API 호출 */
  const fetchUserInfo = async () => {
    try {
      const result = await userInfoApi()
      setUserInfo(result.data)
    } catch (err) {
      console.error('회원 정보 조회 에러: ', err)
    }
  }

  const openProfileModal = () => {
    setIsProfileModalOpen(true)
  }

  const closeProfileModal = () => {
    setIsProfileModalOpen(false)
  }

  /**이전 여행 조회 API 호출 */
  const fetchAllTrip = useCallback(async (page) => {
    if (!hasMoreAllTripsRef.current && page > 0) return
    try {
      const result = await readTripByStatusApi({ status: 'ALL', page })
      const newTrips = result.data.content
      if (page === 0) {
        setAllTrips(newTrips)
      } else {
        setAllTrips((prev) => [...prev, ...newTrips])
      }
      if (newTrips.length < 3) {
        setHasMoreAllTrips(false)
      }
    } catch (err) {
      alert(err.message)
    }
  }, [])

  const loadMoreAllTrips = () => {
    const nextPage = allTripsPage + 1
    setAllTripsPage(nextPage)
    fetchAllTrip(nextPage)
  }

  useEffect(() => {
    fetchUserInfo()
    fetchAllTrip(0)
  }, [fetchAllTrip])

  return (
    <>
      <div className='flex w-full flex-col gap-15 bg-[var(--Grey-Scale-grey-50)] pt-10 pb-50'>
        {/* 마이페이지 유저정보 */}
        <div className='px-10'>
          <h1 className='text-4xl leading-normal font-bold text-[var(--Grey-Scale-grey-400)]'>
            {userInfo.nickname}님의
            <br />
            마이페이지
          </h1>
        </div>
        {/* 프로필카드 */}
        <ProfileCard userInfo={userInfo} onProfileClick={openProfileModal} />

        {/* 모든 여행 전체보기 */}
        <AllTrip allTrips={allTrips || []} loadMore={loadMoreAllTrips} />
        <div className='h-5 bg-[var(--Grey-Scale-grey-100)]' />
        {/* 이외 기능 추가 */}
        <AccountSettings />

        <HomeButton currentPage='mypage' />
      </div>
      {isProfileModalOpen && (
        <ProfileModal
          userInfo={userInfo}
          onClose={closeProfileModal}
          onUpdate={fetchUserInfo}
        />
      )}
    </>
  )
}

export default MyPage
