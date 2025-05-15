/**logout 함수가 삽입될 변수 */
let logoutCallback = null

/**logoutCallback 변수에 logout 함수 담기 */
export const setLogoutCallback = (callback) => {
  logoutCallback = callback
}

/**logout 실행, logout이 로드되지 않았으면 경고 출력 */
export const callLogout = () => {
  if (typeof logoutCallback === 'function') {
    logoutCallback()
  } else {
    console.warn('로그아웃이 아직 설정되지 않았습니다.')
  }
}
