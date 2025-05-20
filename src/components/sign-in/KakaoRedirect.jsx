import oauthSignInApi from '@/apis/authentication/oauthSignInApi'
import useAuth from '@/hooks/useAuth'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const KakaoRedirect = () => {
  const location = useLocation()
  const { login } = useAuth()

  useEffect(() => {
    const queryPrams = new URLSearchParams(location.search)
    const code = queryPrams.get('code')

    if (code) {
      fetchKakaoAccessToken(code)
    }
  }, [location])

  /**카카오 소셜 로그인 호출 */
  const fetchKakaoAccessToken = async (code) => {
    try {
      const response = await oauthSignInApi('KAKAO', code)
      login({ token: response.data.token.accessToken })
      console.log('카카오 로그인 성공', response)
    } catch (error) {
      console.error('카카오 로그인 중 오류 발생:', error.message)
    }
  }
}

export default KakaoRedirect
