import { useLocation } from 'react-router-dom'
import createButton from '@/assets/home/createButton.png'
import HomeIcon from '@/assets/home/HomeIcon'
import MyPageIcon from '@/assets/home/MyPageIcon'

/**홈 화면 하단 버튼바 */
const HomeButton = ({ toggleCreateTripModal }) => {
  const location = useLocation()
  const currentPath = location.pathname

  const isHomePage = currentPath === '/'
  const isMyPage = currentPath === '/mypage'

  const homeIconColor = isHomePage
    ? 'var(--Blue-Scale-blue-500)'
    : 'var(--Grey-Scale-grey-200)'

  const myPageIconColor = isMyPage
    ? 'var(--Blue-Scale-blue-500)'
    : 'var(--Grey-Scale-grey-200)'

  return (
    <div>
      {/* 가운데 버튼 상단 그림자 */}
      <div className='fixed bottom-0 left-0 z-30 flex w-full justify-center'>
        <div className='flex w-4xl items-center justify-around p-[15px]'>
          <HomeIcon color={homeIconColor} opacity={0} />
          <div className='h-[150px] w-[150px] rounded-full shadow-[0_0_4px_rgba(0,0,0,0.10)]' />
          <MyPageIcon color={myPageIconColor} opacity={0} />
        </div>
      </div>

      {/* 하단바 배경 */}
      <div className='fixed bottom-0 left-0 z-30 flex w-full justify-center'>
        <div className='flex w-4xl items-center justify-around rounded-t-[20px] bg-[var(--Grey-Scale-grey-00)] p-[15px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
          <HomeIcon color={homeIconColor} opacity={0} />
          <div></div>
          <MyPageIcon color={myPageIconColor} opacity={0} />
        </div>
      </div>

      {/* 하단바 실제 버튼 */}
      <div className='fixed bottom-0 left-0 z-30 flex w-full justify-center'>
        <div className='flex w-4xl items-end justify-around rounded-t-[20px] p-[15px]'>
          <HomeIcon color={homeIconColor} />
          <img
            src={createButton}
            onClick={toggleCreateTripModal}
            className='h-[150px] w-[150px]'
          />
          <MyPageIcon color={myPageIconColor} />
        </div>
      </div>
    </div>
  )
}

export default HomeButton
