import kakaoButton from '@/assets/sign-in/kakaoLogo.png'
import naverButton from '@/assets/sign-in/naverLogo.png'
import { kakaoLoginUrl, naverLoginUrl } from '@/config/Url'

const SignInButton = () => null
const ButtonStyle = 'mx-auto cursor-pointer h-aut0 w-20'

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
      <img src={naverButton} alt='네이버 로그인' className={ButtonStyle} />
    </a>
  )
}

export default SignInButton
