import {
  kakaoClientId,
  kakaoRedirectUri,
  naverClientId,
  naverRedirectUri,
} from './Env'

/**네이버 로그인 state 파라미터 생성*/
const state = crypto.randomUUID()
export const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${kakaoRedirectUri}&response_type=code`
export const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?client_id=${naverClientId}&redirect_uri=${naverRedirectUri}&response_type=code&state=${state}`
