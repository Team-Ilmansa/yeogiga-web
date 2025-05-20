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
      login({ token: response.data.token.accessToken })
      console.log('네이버 로그인 성공', response)
      navigate('/')
    } catch (error) {
      console.error('네이버 로그인 중 오류 발생:', error.message)
    }
  }
}

export default NaverRedirect
