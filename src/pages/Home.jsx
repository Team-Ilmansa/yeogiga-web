import signOutApi from '@/apis/authentication/signOutApi'
import createTripApi from '@/apis/trip/createTripApi'
import readMainTripApi from '@/apis/trip/readMainApi'
import useAuth from '@/hooks/useAuth'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  const { user, logout } = useAuth()
  const [isCreateTripInputOpen, setIsCreateTripInputOpen] = useState(false)
  const [isReadMainTripListOpen, setIsReadMainTripListOpen] = useState(false)
  const [tripTitle, setTripTitle] = useState('')
  const [tripCity, setTripCity] = useState('')
  const [mainTrip, setMainTrip] = useState(null)

  /**버튼 클릭 시 로그아웃 로직
   * TODO: 상단 NavBar로 옮기기 */
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
      const result = await createTripApi({ title: tripTitle, city: tripCity })
      alert('여행이 성공적으로 생성되었습니다!')
      setIsCreateTripInputOpen(false)
    } catch (err) {
      alert(err.message)
    }
  }

  /**여행 생성 창 출력 상태 토글 */
  const toggleCreateTripInput = () => {
    setIsCreateTripInputOpen((prev) => !prev)
    setTripTitle('')
    setTripCity('')
  }

  /**메인 화면 내 여행 조회 API 호출 */
  useEffect(() => {
    const fetchMainTrip = async () => {
      try {
        const result = await readMainTripApi()
        setMainTrip(result)
        console.log(result)
      } catch (err) {
        alert(err.message)
      }
    }
    if (user) fetchMainTrip()
  }, [])

  /**메인 화면 내 여행 출력 상태 토글 */
  const toggleReadMainTripList = () => {
    setIsReadMainTripListOpen((prev) => !prev)
  }

  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center'>
      <h1 className='text-3xl'>
        {user ? `안녕하세요! ${user.nickname}님!` : '로그인해 주세요'}
      </h1>

      <nav className='mt-5 flex flex-col gap-2'>
        {user ? (
          <>
            <button onClick={handleSignOut}>로그아웃</button>
            <Link to='/mypage' className='link'>
              마이 페이지
            </Link>
            <button onClick={toggleCreateTripInput}>여행 생성하기</button>
            <button onClick={toggleReadMainTripList}>여행 읽기</button>
          </>
        ) : (
          <>
            <Link to='/signin' className='link'>
              로그인
            </Link>
            <Link to='/signup' className='link'>
              회원가입
            </Link>
          </>
        )}
      </nav>
      {isCreateTripInputOpen && (
        <fieldset className='rounded-2xl border p-4'>
          <legend className='p-2'>여행 생성</legend>
          <form
            onSubmit={createTrip}
            className='flex flex-col items-center justify-center gap-2'
          >
            <input
              placeholder='여행 이름을 입력해주세요.'
              value={tripTitle}
              onChange={(e) => setTripTitle(e.target.value)}
              className='w-75'
              type='text'
            />
            <input
              placeholder='여행 갈 목적지를 입력해주세요'
              value={tripCity}
              onChange={(e) => setTripCity(e.target.value)}
              className='w-75'
              type='text'
            />
            <button type='submit'>생성하기</button>
          </form>
        </fieldset>
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
    </div>
  )
}

export default Home
