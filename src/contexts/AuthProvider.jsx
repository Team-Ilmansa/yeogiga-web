import { useCallback, useEffect, useMemo, useState } from 'react'
import AuthContext from './AuthContext'
import {
  loadTokenFromStorage,
  loadUserFromStorage,
  parseNicknameFromToken,
  saveAuthToStorage,
} from './AuthUtil'

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
      const nickname = parseNicknameFromToken(storedToken)
      if (nickname) {
        setUser((prev) => ({ ...prev, nickname }))
      }
    }
  }, [])

  /**로그인 시 세션 스토리지에 사용자 정보 및 Access Token 저장 */
  const login = useCallback(({ user, token }) => {
    const nickname = parseNicknameFromToken(token)
    setUser({ ...user, nickname })
    setAccessToken(token)
    saveAuthToStorage({ ...user, nickname }, token)
  }, [])

  /**로그아웃 시 세션 스토리지 및 user, accessToken 초기화 */
  const logout = useCallback(() => {
    setUser(null)
    setAccessToken(null)
    clearStorage()
    window.location.href = '/'
  }, [])

  /**웹 전체에 전역으로 공급 */
  const value = useMemo(
    () => ({ user, accessToken, login, logout }),
    [user, accessToken, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
