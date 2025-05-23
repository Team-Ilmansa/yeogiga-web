/**세션 스토리지에 저장된 사용자 정보를 JSON으로 가져오기 위한 함수 */
export const loadUserFromStorage = () => {
  try {
    const storedUser = sessionStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  } catch (err) {
    console.error('세션 스토리지에서 유저 데이터를 파싱하는 중 오류: ', err)
    sessionStorage.removeItem('user')
    return null
  }
}

/**세션 스토리지에서 저장된 Access Token을 가져오기 위한 함수 */
export const loadTokenFromStorage = () => {
  try {
    return sessionStorage.getItem('accessToken')
  } catch (err) {
    console.error('세션 스토리지에서 토큰을 읽는 중 오류: ', err)
  }
}

/**인코딩되어 전달되는 Access Token 디코딩 */
export const decodeToken = (token) => {
  try {
    const base64Payload = token.split('.')[1]
    if (!base64Payload) throw new Error('유효하지 않은 토큰 구조')
    const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/')
    const payload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    )
    return JSON.parse(payload)
  } catch (error) {
    console.error('토큰 디코딩 중 오류 발생:', error)
    return null
  }
}

/**디코딩 된 Access Token에서 닉네임 및 로그인타입 가져오기 */
export const parsingFromToken = (token) => {
  const decoded = decodeToken(token)
  if (!decoded) return { nickname: null, loginType: null }
  const { nickname, loginType } = decoded
  return { nickname, loginType }
}

/**사용자 정보와 Access Token을 세션 스토리지에 저장 */
export const saveAuthToStorage = (user, token) => {
  sessionStorage.setItem('user', JSON.stringify(user))
  sessionStorage.setItem('accessToken', token)
}

/**세션 스토리지 지우기 */
export const clearStorage = () => {
  sessionStorage.removeItem('user')
  sessionStorage.removeItem('accessToken')
  sessionStorage.removeItem('stockData')
}
