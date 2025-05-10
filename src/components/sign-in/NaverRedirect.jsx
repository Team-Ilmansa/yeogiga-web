import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import oauthSignInApi from '@/apis/authentication/oauthSignInApi'

const NaverRedirect = () => {
  const location = useLocation()

  useEffect(() => {
    const queryPrams = new URLSearchParams(location.search)
    const code = queryPrams.get('code')

    if (code) {
      fetchNaverAccessToken(code)
    }
  }, [location])

  const fetchNaverAccessToken = async (code) => {
    try {
      const response = await oauthSignInApi('NAVER', code)
      console.log('네이버 로그인 성공', response)
    } catch (error) {
      console.error('네이버 로그인 중 오류 발생:', error.message)
    }
  }
}

export default NaverRedirect
