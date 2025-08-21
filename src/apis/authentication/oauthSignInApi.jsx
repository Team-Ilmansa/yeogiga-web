import api from '@/apis/api'
import { localBaseUrl } from '@/config/Env'

/**Oauth 로그인 API */
const oauthSignInApi = async (platform, code) => {
  try {
    const response = await api.post(
      `${localBaseUrl}oauth/sign-in/${platform}/web`,
      { code },
    )
    return response.data
  } catch (err) {
    throw err
  }
}

export default oauthSignInApi
