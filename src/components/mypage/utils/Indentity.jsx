/** 세션에서 user JSON 파싱 */
export function parseStoredUser() {
  const raw = sessionStorage.getItem('user')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/** 로그인 타입 결정*/
export function getLoginType(userInfo) {
  let loginType = ''

  if (userInfo && typeof userInfo === 'object' && userInfo.loginType) {
    loginType = String(userInfo.loginType)
  } else {
    const storedUser = parseStoredUser()
    if (storedUser && storedUser.loginType) {
      loginType = String(storedUser.loginType)
    }
  }

  return loginType.trim().toUpperCase()
}

/** 소셜 provider 결정 */
export function getProvider(userInfo) {
  let provider = ''

  if (userInfo && typeof userInfo === 'object') {
    if (userInfo.provider) {
      provider = String(userInfo.provider)
    } else if (userInfo.oauthProvider) {
      provider = String(userInfo.oauthProvider)
    } else if (userInfo.socialType) {
      provider = String(userInfo.socialType)
    }
  }

  if (!provider) {
    const fromLocal = localStorage.getItem('provider')
    if (fromLocal) {
      provider = String(fromLocal)
    } else {
      const fromSession = sessionStorage.getItem('provider')
      if (fromSession) provider = String(fromSession)
    }
  }

  return provider.trim().toUpperCase()
}
