import kakaoButton from '@/assets/sign-in/kakaoLogo.png'
import naverButton from '@/assets/sign-in/naverLogo.png'
import { kakaoLoginUrl, naverLoginUrl } from '@/config/Url'

const SignInButton = () => null
const ButtonStyle = 'mx-auto cursor-pointer h-aut0 w-20'

SignInButton.KakaoLogin = ({ redirectUrl }) => {
  const finalUrl = redirectUrl
    ? `${kakaoLoginUrl}&state=${encodeURIComponent(redirectUrl)}`
    : kakaoLoginUrl

  return (
    <a href={finalUrl}>
      <img src={kakaoButton} alt='카카오 로그인' className={ButtonStyle} />
    </a>
  )
}

SignInButton.NaverLogin = ({ redirectUrl }) => {
  const finalUrl = redirectUrl
    ? `${naverLoginUrl}&state=${encodeURIComponent(redirectUrl)}`
    : naverLoginUrl
  return (
    <a href={finalUrl}>
      <img src={naverButton} alt='네이버 로그인' className={ButtonStyle} />
    </a>
  )
}

export default SignInButton
