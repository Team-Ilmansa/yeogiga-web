import createButton from '@/assets/home/createButton.png'
import HomeIcon from '@/assets/home/HomeIcon'
import MyPageIcon from '@/assets/home/MyPageIcon'

/**홈 화면 하단 버튼바 */
const HomeButton = () => {
  return (
    <div>
      <div className='fixed bottom-0 left-0 flex w-full justify-center'>
        <div className='flex w-4xl items-center justify-around rounded-t-[20px] bg-[var(--Grey-Scale-grey-00)] p-[15px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
          <HomeIcon color='var(--Blue-Scale-blue-500)' />
          <div></div>
          <MyPageIcon color='var(--Grey-Scale-grey-200)' />
        </div>
      </div>
      <div className='fixed bottom-0 left-0 flex w-full justify-center'>
        <img src={createButton} className='h-[150px] w-[150px]' />
      </div>
    </div>
  )
}

export default HomeButton
