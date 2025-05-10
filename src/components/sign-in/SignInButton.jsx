import kakaoButton from '@/assets/kakaoButton.png'
import naverButton from '@/assets/naverButton.png'
import { kakaoLoginUrl, naverLoginUrl } from '@/config/Url'

const SignInButton = () => null
const ButtonStyle = 'mx-auto w-50 cursor-pointer'

SignInButton.KakaoLogin = () => {
  return (
    <a href={kakaoLoginUrl}>
      <img src={kakaoButton} alt='카카오 로그인' className={ButtonStyle} />
    </a>
  )
}
SignInButton.NaverLogin = () => {
  return (
    <a href={naverLoginUrl}>
      <img
        src={naverButton}
        alt='네이버 로그인'
        className={`${ButtonStyle} mt-3`}
      />
    </a>
  )
}

export default SignInButton
