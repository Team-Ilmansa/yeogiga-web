import api from '@/apis/api'

/**Oauth 로그인 API */
const oauthSignInApi = async (platform, code) => {
  try {
    const response = await api.post(`oauth/sign-in/${platform}/web`, { code })
    return response.data
  } catch (err) {
    throw err
  }
}

export default oauthSignInApi
