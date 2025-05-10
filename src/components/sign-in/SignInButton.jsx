import kakaoButton from '@/assets/kakaoButton.png'
import { kakaoLoginUrl } from '@/config/Url'

const SignInButton = () => {
  return null
}

SignInButton.KakaoLogin = () => {
  return (
    <a href={kakaoLoginUrl}>
      <img
        src={kakaoButton}
        alt='카카오 로그인'
        className='mx-auto w-50 cursor-pointer'
      />
    </a>
  )
}

export default SignInButton
