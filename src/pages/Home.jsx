import signOutApi from '@/apis/authentication/signOutApi'
import useAuth from '@/hooks/useAuth'
import { Link } from 'react-router-dom'

const Home = () => {
  const { user, logout } = useAuth()

  /**버튼 클릭 시 로그아웃 로직
   * TODO: 상단 NavBar로 옮기기 */
  const handleSignOut = async () => {
    try {
      const result = await signOutApi()
      console.log('로그아웃 성공:', result)
      logout()
    } catch (error) {
      console.error('로그아웃 중 오류 발생: ', error.message)
    }
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
    </div>
  )
}

export default Home
