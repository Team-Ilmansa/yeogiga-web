import signOutApi from '@/apis/authentication/signOutApi'
import createTripApi from '@/apis/trip/createTripApi'
import readMainTripApi from '@/apis/trip/readMainApi'
import readSettingTripApi from '@/apis/trip/readSettingTripApi'
import readTripApi from '@/apis/trip/readTripApi'
import CreateTripModal from '@/components/home/CreateTripModal'
import HomeButton from '@/components/home/HomeButton'
import HomeTitle from '@/components/home/HomeTitle'
import PastTrips from '@/components/home/PastTrips'
import RecommendedPlaces from '@/components/home/RecommendedPlaces'
import TrendingPlaces from '@/components/home/TrendingPlaces'
import useAuth from '@/hooks/useAuth'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Home = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  /**여행 생성 모달창 토글 */
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false)
  /**여행 이름 */
  const [tripTitle, setTripTitle] = useState('')

  const [isReadMainTripListOpen, setIsReadMainTripListOpen] = useState(false)
  const [isReadTripListOpen, setIsReadTripListOpen] = useState(false)
  const [mainTrip, setMainTrip] = useState(null)
  const [settingTrips, setSettingTrips] = useState(null)
  const [trips, setTrips] = useState(null)

  /**버튼 클릭 시 로그아웃 */
  const handleSignOut = async () => {
    try {
      const result = await signOutApi()
      logout()
    } catch (error) {
      console.error('로그아웃 중 오류 발생: ', error.message)
    }
  }

  /**여행 생성 API 호출 */
  const createTrip = async (e) => {
    e.preventDefault()
    try {
      const result = await createTripApi({ title: tripTitle })
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

  useEffect(() => {
    // user 로드 중 로그아웃 방지
    if (user === null) return

    /**메인 화면 내 여행 조회 API 호출 */
    const fetchMainTrip = async () => {
      try {
        const result = await readMainTripApi()
        setMainTrip(result)
      } catch (err) {
        alert(err.message)
      }
    }

    /**준비 중 여행 조회 API 호출 */
    const fetchSettingTrip = async () => {
      try {
        const result = await readSettingTripApi()
        setSettingTrips(result.data)
      } catch (err) {
        alert(err.message)
      }
    }

    // 미 로그인 상태라면 로그인 화면으로 이동
    if (!user) {
      navigate('/signin')
    }
    // 로그인된 상태일 때만 데이터 요청
    else {
      fetchMainTrip()
      fetchSettingTrip()
    }
  }, [user])

  /**메인 화면 내 여행 출력 상태 토글 */
  const toggleReadMainTripList = () => {
    setIsReadMainTripListOpen((prev) => !prev)
  }

  /**사용자가 속한 여행 조회 APU 호출 */
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const result = await readTripApi()
        setTrips(result)
      } catch (err) {
        alert(err.message)
      }
    }
    if (user) fetchTrip()
  }, [])

  /**사용자가 속한 여행 출력 상태 토글 */
  const toggleReadTripList = () => {
    setIsReadTripListOpen((prev) => !prev)
  }

  return (
    <div className='flex w-full flex-col gap-15 bg-[var(--Grey-Scale-grey-50)] pt-10 pb-50 pl-10'>
      <HomeTitle user={user} />
      {/* TODO: PLANNED or PROGRESSED 여행 존재 시 출력 */}
      <RecommendedPlaces user={user} />
      <TrendingPlaces />
      <PastTrips />
      <nav className='flex flex-col gap-2'>
        <button onClick={handleSignOut}>로그아웃</button>
        <Link to='/mypage' className='link'>
          마이 페이지
        </Link>
        <button onClick={toggleReadMainTripList}>여행 읽기</button>
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

      {isReadMainTripListOpen && (
        <fieldset className='rounded-2xl border p-4'>
          <legend className='p-2'>여행 목록</legend>
          {mainTrip ? (
            <ul>
              <li key={mainTrip.tripId}>
                <h3>{mainTrip.title}</h3>
                <p>시작일: {mainTrip.staredAt}</p>
                <p>상태: {mainTrip.travelStatus}</p>
                <p>일차: {mainTrip.day}</p>
                <ul>
                  {Array.isArray(mainTrip.places) &&
                  mainTrip.places.length > 0 ? (
                    mainTrip.places.map((place) => (
                      <li key={place.id}>
                        - {place.name} ({place.placeType}) / 방문여부:{' '}
                        {place.isVisited ? 'O' : 'X'}
                      </li>
                    ))
                  ) : (
                    <li>장소 정보가 없습니다.</li>
                  )}
                </ul>
              </li>
            </ul>
          ) : (
            <p>여행 정보가 없습니다.</p>
          )}
        </fieldset>
      )}
      {isReadTripListOpen && (
        <fieldset className='rounded-2xl border p-4'>
          <legend className='p-2'>내가 속한 여행 목록</legend>
          {Array.isArray(trips) && trips.length > 0 ? (
            trips.map((trip) => (
              <div key={trip.tripId} className='mb-4 border-b pb-2'>
                <h3 className='text-xl font-bold'>{trip.title}</h3>
                <p>도시: {trip.city}</p>
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
      {settingTrips && (
        <fieldset className='rounded-2xl border p-4'>
          <legend className='p-2'>준비 중인 여행</legend>
          {settingTrips.map((settingTrip) => (
            <Link key={settingTrip.tripId} to={`trip/${settingTrip.tripId}`}>
              {settingTrip.title}
            </Link>
          ))}
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
