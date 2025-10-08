import createTripApi from '@/apis/trip/createTripApi'
import readTripByStatusApi from '@/apis/trip/readTripByStatusApi'
import CreateTripModal from '@/components/home/CreateTripModal'
import HomeButton from '@/components/home/HomeButton'
import HomeTitle from '@/components/home/HomeTitle'
import PastTrips from '@/components/home/PastTrips'
import RecommendedPlaces from '@/components/home/RecommendedPlaces'
import TrendingPlaces from '@/components/home/TrendingPlaces'
import useAuth from '@/hooks/useAuth'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PlannedTripSlide from '@/components/home/utils/PlannedTripSlide'

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  /**여행 생성 모달창 토글 */
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false)
  /**여행 이름 */
  const [tripTitle, setTripTitle] = useState('')

  const [isReadTripListOpen, setIsReadTripListOpen] = useState(false)
  const [settingTrips, setSettingTrips] = useState(null)
  const [pastTrips, setPastTrips] = useState(null)
  const [trips, setTrips] = useState(null)

  /**여행 생성 API 호출 */
  const createTrip = async (e) => {
    e.preventDefault()
    try {
      await createTripApi({ title: tripTitle })
      alert('여행이 성공적으로 생성되었습니다!')
      setIsCreateTripModalOpen(false)
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
  const fetchSettingTrip = async () => {
    try {
      const result = await readTripByStatusApi({ status: 'SETTING' })
      const sortedTrips = result.data.content.sort(
        (a, b) => b.tripId - a.tripId,
      )
      setSettingTrips(sortedTrips)
    } catch (err) {
      alert(err.message)
    }
  }

  /**이전 여행 조회 API 호출 */
  const fetchPastTrip = async () => {
    try {
      const result = await readTripByStatusApi({ status: 'COMPLETED' })
      setPastTrips(result.data.content)
    } catch (err) {
      alert(err.message)
    }
  }

  /**사용자가 속한 여행 조회 API 호출 */
  const fetchMyTrip = async () => {
    try {
      const result = await readTripByStatusApi({ status: 'ALL' })
      setTrips(result.data.content)
    } catch (err) {
      alert(err.message)
    }
  }

  useEffect(() => {
    fetchSettingTrip()
    fetchPastTrip()
    fetchMyTrip()
  }, [])

  /**사용자가 속한 여행 출력 상태 토글 */
  const toggleReadTripList = () => {
    setIsReadTripListOpen((prev) => !prev)
  }

  return (
    <div className='flex w-full flex-col gap-15 bg-[var(--Grey-Scale-grey-50)] pb-50'>
      <HomeTitle user={user} />
      <PlannedTripSlide settingTrips={settingTrips || []} />
      <RecommendedPlaces user={user} />
      <TrendingPlaces />
      <PastTrips pastTrips={pastTrips || []} />
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
