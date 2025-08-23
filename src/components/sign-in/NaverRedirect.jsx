import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import oauthSignInApi from '@/apis/authentication/oauthSignInApi'
import useAuth from '@/hooks/useAuth'

const NaverRedirect = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  useEffect(() => {
    const queryPrams = new URLSearchParams(location.search)
    const code = queryPrams.get('code')

    if (code) {
      fetchNaverAccessToken(code)
    }
  }, [location])

  /**네이버 소셜 로그인 호출 */
  const fetchNaverAccessToken = async (code) => {
    try {
      const response = await oauthSignInApi('NAVER', code)

      const accessToken = response.data.token.accessToken
      const shouldSignup = response.data.shouldSignup === true

      localStorage.setItem('provider', 'NAVER')

      if (accessToken) {
        login({ token: accessToken })
      }

      /**최초 소셜 회원가입 시 게스트 회원등록 페이지로 이동 */
      if (shouldSignup) {
        navigate('/signup/guest')
      } else {
        navigate('/')
      }
    } catch (error) {
      const errRes = error.response?.data
      /**탈퇴 계정 로그인 시 복구 페이지로 이동 */
      if (errRes?.data?.userId && errRes?.data?.deletionExpiration) {
        alert('탈퇴된 계정입니다. 계정 복구 페이지로 이동합니다.')
        navigate('/restore/account', {
          state: {
            userId: errRes.data.userId,
            deletionDate: errRes.data.deletionExpiration,
          },
        })
      } else {
        alert(`로그인 실패: ${errRes?.message || err.message}`)
        console.error('로그인 에러: ', err)
      }
    }
  }
}

export default NaverRedirect
