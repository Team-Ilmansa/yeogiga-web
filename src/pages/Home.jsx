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
import { Link, useNavigate } from 'react-router-dom'
import PlannedTrips from '@/components/home/PlannedTrips'

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  /**여행 생성 모달창 토글 */
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false)
  /**여행 이름 */
  const [tripTitle, setTripTitle] = useState('')

  const [isReadTripListOpen, setIsReadTripListOpen] = useState(false)
  const [settingTrips, setSettingTrips] = useState([])
  const [settingTripsTotalElements, setSettingTripsTotalElements] = useState(0)
  const [settingTripsPage, setSettingTripsPage] = useState(0)
  const [hasMoreSettingTrips, setHasMoreSettingTrips] = useState(true)

  const [pastTrips, setPastTrips] = useState([])
  const [pastTripsPage, setPastTripsPage] = useState(0)
  const [hasMorePastTrips, setHasMorePastTrips] = useState(true)

  const [trips, setTrips] = useState(null)

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

  /**사용자가 속한 여행 조회 API 호출 */
  const fetchMyTrip = useCallback(async () => {
    try {
      const result = await readTripByStatusApi({ status: 'ALL', size: 20 })
      setTrips(result.data.content)
    } catch (err) {
      alert(err.message)
    }
  }, [])

  useEffect(() => {
    fetchSettingTrip(0)
    fetchPastTrip(0)
    fetchMyTrip()
  }, [fetchSettingTrip, fetchPastTrip, fetchMyTrip])

  /**사용자가 속한 여행 출력 상태 토글 */
  const toggleReadTripList = () => {
    setIsReadTripListOpen((prev) => !prev)
  }

  return (
    <div className='flex w-full flex-col gap-15 bg-[var(--Grey-Scale-grey-50)] pb-50'>
      <HomeTitle user={user} />
      <div className='h-5 bg-[var(--Grey-Scale-grey-100)]' />
      <PlannedTrips
        settingTrips={settingTrips || []}
        loadMore={loadMoreSettingTrips}
        totalElements={settingTripsTotalElements}
      />
      <RecommendedPlaces user={user} />
      <TrendingPlaces />
      <PastTrips pastTrips={pastTrips || []} loadMore={loadMorePastTrips} />
      <nav className='flex flex-col gap-2'>
        <button onClick={toggleReadTripList}>사용자가 속한 여행 읽기</button>
      </nav>

      {isCreateTripModalOpen && (
        <CreateTripModal
          toggleCreateTripModal={toggleCreateTripModal}
          createTrip={createTrip}
          tripTitle={tripTitle}
          setTripTitle={setTripTitle}
        />
      )}

      {isReadTripListOpen && (
        <fieldset className='rounded-2xl border p-4'>
          <legend className='p-2'>내가 속한 여행 목록</legend>
          {Array.isArray(trips) && trips.length > 0 ? (
            trips.map((trip) => (
              <div key={trip.tripId} className='mb-4 border-b pb-2'>
                <h3
                  className='cursor-pointer text-xl font-bold'
                  onClick={() => navigate(`trip/${trip.tripId}`)}
                >
                  {trip.title}
                </h3>
                <p>여행 상태: {trip.status}</p>
                <p>
                  기간: {new Date(trip.startedAt).toLocaleDateString()} ~{' '}
                  {new Date(trip.endedAt).toLocaleDateString()}
                </p>
                <p>
                  여행장:{' '}
                  {trip.leaderId === user.id ? '나' : `User #${trip.leaderId}`}
                </p>
                <div className='mt-2'>
                  <p className='font-semibold'>참여 멤버:</p>
                  <ul className='list-inside list-disc'>
                    {trip.members.map((member) => (
                      <li key={member.userId}>
                        {member.nickname} {member.userId === user.id && '(나0'}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <p>속한 여행이 없습니다.</p>
          )}
        </fieldset>
      )}

      <HomeButton
        urrentPage='/'
        toggleCreateTripModal={toggleCreateTripModal}
      />
    </div>
  )
}

export default Home
