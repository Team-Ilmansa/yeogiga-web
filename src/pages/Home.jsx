import createTripApi from '@/apis/trip/createTripApi'
import readTripByStatusApi from '@/apis/trip/readTripByStatusApi'
import CreateTripModal from '@/components/home/CreateTripModal'
import HomeButton from '@/components/home/HomeButton'
import HomeTitle from '@/components/home/HomeTitle'
import PastTrips from '@/components/home/PastTrips'
import RecommendedPlaces from '@/components/home/RecommendedPlaces'
import TrendingPlaces from '@/components/home/TrendingPlaces'
import useAuth from '@/hooks/useAuth'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PlannedTrips from '@/components/home/PlannedTrips'

const Home = () => {
  const { user } = useAuth()

  /**여행 생성 모달창 토글 */
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false)
  /**여행 이름 */
  const [tripTitle, setTripTitle] = useState('')

  const [settingTrips, setSettingTrips] = useState([])
  const [settingTripsTotalElements, setSettingTripsTotalElements] = useState(0)
  const [settingTripsPage, setSettingTripsPage] = useState(0)
  const [hasMoreSettingTrips, setHasMoreSettingTrips] = useState(true)

  const [pastTrips, setPastTrips] = useState([])
  const [pastTripsPage, setPastTripsPage] = useState(0)
  const [hasMorePastTrips, setHasMorePastTrips] = useState(true)

  const hasMoreSettingTripsRef = useRef(hasMoreSettingTrips)
  hasMoreSettingTripsRef.current = hasMoreSettingTrips

  const hasMorePastTripsRef = useRef(hasMorePastTrips)
  hasMorePastTripsRef.current = hasMorePastTrips

  /**여행 생성 API 호출 */
  const createTrip = async (e) => {
    e.preventDefault()
    try {
      await createTripApi({ title: tripTitle })
      alert('여행이 성공적으로 생성되었습니다!')
      setIsCreateTripModalOpen(false)
      fetchSettingTrip(0)
    } catch (err) {
      alert(err.message)
    }
  }

  /**여행 생성 창 출력 상태 토글 */
  const toggleCreateTripModal = () => {
    setIsCreateTripModalOpen((prev) => !prev)
    setTripTitle('')
  }

  /**준비 중 여행 조회 API 호출 */
  const fetchSettingTrip = useCallback(async (page) => {
    if (!hasMoreSettingTripsRef.current && page > 0) return
    try {
      const result = await readTripByStatusApi({ status: 'SETTING', page })
      const newTrips = result.data.content
      if (page === 0) {
        setSettingTrips(newTrips)
        setSettingTripsTotalElements(result.data.page.totalElements)
      } else {
        setSettingTrips((prev) => [...prev, ...newTrips])
      }
      if (newTrips.length < 3) {
        setHasMoreSettingTrips(false)
      }
    } catch (err) {
      alert(err.message)
    }
  }, [])

  const loadMoreSettingTrips = () => {
    const nextPage = settingTripsPage + 1
    setSettingTripsPage(nextPage)
    fetchSettingTrip(nextPage)
  }

  /**이전 여행 조회 API 호출 */
  const fetchPastTrip = useCallback(async (page) => {
    if (!hasMorePastTripsRef.current && page > 0) return
    try {
      const result = await readTripByStatusApi({ status: 'COMPLETED', page })
      const newTrips = result.data.content
      if (page === 0) {
        setPastTrips(newTrips)
      } else {
        setPastTrips((prev) => [...prev, ...newTrips])
      }
      if (newTrips.length < 3) {
        setHasMorePastTrips(false)
      }
    } catch (err) {
      alert(err.message)
    }
  }, [])

  const loadMorePastTrips = () => {
    const nextPage = pastTripsPage + 1
    setPastTripsPage(nextPage)
    fetchPastTrip(nextPage)
  }

  useEffect(() => {
    fetchSettingTrip(0)
    fetchPastTrip(0)
  }, [fetchSettingTrip, fetchPastTrip])

  return (
    <div className='flex w-full flex-col gap-15 bg-[var(--Grey-Scale-grey-50)] pb-50'>
      <HomeTitle user={user} />
      <div className='h-5 bg-[var(--Grey-Scale-grey-100)]' />
      <PlannedTrips
        settingTrips={settingTrips || []}
        loadMore={loadMoreSettingTrips}
        totalElements={settingTripsTotalElements}
      />
      {/** 추천 여행지 및 인기 여행지 숨기기 */}
      {/* <RecommendedPlaces user={user} />*/}
      <TrendingPlaces />
      <PastTrips pastTrips={pastTrips || []} loadMore={loadMorePastTrips} />

      {isCreateTripModalOpen && (
        <CreateTripModal
          toggleCreateTripModal={toggleCreateTripModal}
          createTrip={createTrip}
          tripTitle={tripTitle}
          setTripTitle={setTripTitle}
        />
      )}

      <HomeButton
        urrentPage='/'
        toggleCreateTripModal={toggleCreateTripModal}
      />
    </div>
  )
}

export default Home
