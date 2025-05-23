import { useCallback, useEffect, useMemo, useState } from 'react'
import AuthContext from './AuthContext'
import {
  clearStorage,
  loadTokenFromStorage,
  loadUserFromStorage,
  parsingFromToken,
  saveAuthToStorage,
} from './AuthUtil'
import { setLogoutCallback } from '@/apis/authentication/logoutHandler'

/**React Context API를 이용한 전역 관리 컴포넌트 */
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)

  useEffect(() => {
    const storedUser = loadUserFromStorage()
    const storedToken = loadTokenFromStorage()

    if (storedUser) setUser(storedUser)
    if (storedToken) {
      setAccessToken(storedToken)
      const { nickname, loginType } = parsingFromToken(storedToken)
      if (nickname || loginType) {
        setUser((prev) => ({ ...prev, nickname, loginType }))
      }
    }
  }, [])

  /**로그인 시 세션 스토리지에 사용자 정보 및 Access Token 저장 */
  const login = useCallback(({ user, token }) => {
    const { nickname, loginType } = parsingFromToken(token)
    const userWithTokenInfo = { ...user, nickname, loginType }
    setUser(userWithTokenInfo)
    setAccessToken(token)
    saveAuthToStorage(userWithTokenInfo, token)
  }, [])

  /**로그아웃 시 세션 스토리지 및 user, accessToken 초기화 */
  const logout = useCallback(() => {
    setUser(null)
    setAccessToken(null)
    clearStorage()
    window.location.href = '/'
  }, [])

  /**AuthProvier가 로드되면서 logout 함수를 logoutCallback 변수로 삽입 */
  useEffect(() => {
    setLogoutCallback(logout)
  }, [logout])

  /**웹 전체에 전역으로 공급 */
  const value = useMemo(
    () => ({ user, accessToken, login, logout }),
    [user, accessToken, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
