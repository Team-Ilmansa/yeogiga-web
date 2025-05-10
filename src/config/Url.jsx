import { kakaoClientId, kakaoRedirectUri } from './Env'

export const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${kakaoRedirectUri}&response_type=code`
