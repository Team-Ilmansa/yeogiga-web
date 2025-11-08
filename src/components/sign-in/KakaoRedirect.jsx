import oauthSignInApi from '@/apis/authentication/oauthSignInApi'
import useAuth from '@/hooks/useAuth'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const KakaoRedirect = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const code = queryParams.get('code')

    const fetchKakaoAccessToken = async () => {
      try {
        const response = await oauthSignInApi('KAKAO', code)
        const accessToken = response?.data?.token?.accessToken
        const shouldSignup = response?.data?.shouldSignup === true

        if (accessToken) {
          localStorage.setItem('provider', 'KAKAO')
          sessionStorage.removeItem('provider')

          login({ token: accessToken })
        }

        if (shouldSignup) {
          navigate('/signup/guest', { replace: true })
        } else {
          navigate('/', { replace: true })
        }
      } catch (error) {
        const errRes = error.response?.data
        if (errRes?.data?.userId && errRes?.data?.deletionExpiration) {
          alert('탈퇴된 계정입니다. 계정 복구 페이지로 이동합니다.')
          navigate('/restore/account', {
            replace: true,
            state: {
              userId: errRes.data.userId,
              deletionDate: errRes.data.deletionExpiration,
            },
          })
        } else {
          alert(`로그인 실패: ${errRes?.message || error.message}`)
          console.error('로그인 에러: ', error)
          navigate('/login', { replace: true })
        }
      }
    }

    fetchKakaoAccessToken()
  }, [location.search, login, navigate])

  return null
}

export default KakaoRedirect
