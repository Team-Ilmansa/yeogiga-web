import api from '@/apis/api'

/** 일반 로그인 API */
const regularSignInApi = async (body) => {
  try {
    const response = await api.post('auth/sign-in', body, {
      headers: { device: 'WEB' },
    })
    return response.data
  } catch (err) {
    throw err
  }
}

export default regularSignInApi
