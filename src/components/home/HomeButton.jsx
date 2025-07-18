import createButton from '@/assets/home/createButton.png'
import HomeIcon from '@/assets/home/HomeIcon'
import MyPageIcon from '@/assets/home/MyPageIcon'

/**홈 화면 하단 버튼바 */
const HomeButton = ({ toggleCreateTripModal }) => {
  return (
    <div>
      {/* 가운데 버튼 상단 그림자 생성을 위한 요소 */}
      <div className='fixed bottom-0 left-0 flex w-full justify-center'>
        <div className='flex w-4xl items-center justify-around p-[15px]'>
          <HomeIcon color='var(--Blue-Scale-blue-500)' opacity={0} />
          <div className='h-[150px] w-[150px] rounded-full shadow-[0_0_4px_rgba(0,0,0,0.10)]' />
          <MyPageIcon color='var(--Grey-Scale-grey-200)' opacity={0} />
        </div>
      </div>

      {/* 하단바 배경 */}
      <div className='fixed bottom-0 left-0 flex w-full justify-center'>
        <div className='flex w-4xl items-center justify-around rounded-t-[20px] bg-[var(--Grey-Scale-grey-00)] p-[15px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
          <HomeIcon color='var(--Blue-Scale-blue-500)' opacity={0} />
          <div></div>
          <MyPageIcon color='var(--Grey-Scale-grey-200)' opacity={0} />
        </div>
      </div>

      {/* 하단바 실제 버튼 */}
      <div className='fixed bottom-0 left-0 flex w-full justify-center'>
        <div className='flex w-4xl items-end justify-around rounded-t-[20px] p-[15px]'>
          <HomeIcon color='var(--Blue-Scale-blue-500)' />
          <img
            src={createButton}
            onClick={toggleCreateTripModal}
            className='h-[150px] w-[150px]'
          />
          <MyPageIcon color='var(--Grey-Scale-grey-200)' />
        </div>
      </div>
    </div>
  )
}

export default HomeButton
