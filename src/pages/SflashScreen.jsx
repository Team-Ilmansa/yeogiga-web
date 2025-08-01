import logo from '@/assets/sign-in/logo.png'

/**로딩 중에 출력한 스플래시 스크린 */
const SflashScreen = () => {
  return (
    <div className='flex w-full flex-col items-center justify-center bg-[var(--Grey-Scale-grey-50)]'>
      <img src={logo} alt='여기가 로고' className='mb-20 h-auto w-60' />
    </div>
  )
}

export default SflashScreen
