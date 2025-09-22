import { weatherApiKey, weatherApiUrl } from '@/config/Env'
import api from '../api'

/**위경도 -> 격자 좌표 변경 함수*/
const dfs_xy_conv = (code, v1, v2) => {
  const DEGRAD = Math.PI / 180.0
  const RADDEG = 180.0 / Math.PI

  const re = 6371.00877 / 5.0
  const slat1 = 30.0 * DEGRAD
  const slat2 = 60.0 * DEGRAD
  const olon = 126.0 * DEGRAD
  const olat = 38.0 * DEGRAD

  let sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5)
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn)
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5)
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5)
  ro = (re * sf) / Math.pow(ro, sn)
  const rs = {}
  if (code == 'toXY') {
    rs['lat'] = v1
    rs['lng'] = v2
    let ra = Math.tan(Math.PI * 0.25 + v1 * DEGRAD * 0.5)
    ra = (re * sf) / Math.pow(ra, sn)
    let theta = v2 * DEGRAD - olon
    if (theta > Math.PI) theta -= 2.0 * Math.PI
    if (theta < -Math.PI) theta += 2.0 * Math.PI
    theta *= sn
    rs['x'] = Math.floor(ra * Math.sin(theta) + 43 + 0.5)
    rs['y'] = Math.floor(ro - ra * Math.cos(theta) + 136 + 0.5)
  } else {
    rs['x'] = v1
    rs['y'] = v2
    const xn = v1 - 43
    const yn = ro - v2 + 136
    let ra = Math.sqrt(xn * xn + yn * yn)
    if (sn < 0.0) -ra
    let alat = Math.pow((re * sf) / ra, 1.0 / sn)
    alat = 2.0 * Math.atan(alat) - Math.PI * 0.5
    let alon = Math.atan2(xn, yn)
    if (sn < 0.0) alon = -alon
    alon = alon / sn + olon
    rs['lat'] = alat * RADDEG
    rs['lng'] = alon * RADDEG
  }
  return rs
}

/**날씨 정보 불러오기 API */
const getWeatherApi = async (latitude, longitude) => {
  const { x, y } = dfs_xy_conv('toXY', latitude, longitude)

  try {
    const response = await api.get('weather', { params: { nx: x, ny: y } })
    return response.data
  } catch (err) {
    if (err.response?.data?.message) {
      throw err.response.data
    } else if (err.response) {
      throw new Error(`오류 발생 (status: ${err.response.status})`)
    } else if (err.request) {
      throw new Error('서버로부터 응답이 없습니다.')
    } else {
      throw new Error('요청 중 알 수 없는 오류가 발생했습니다.')
    }
  }
}

export default getWeatherApi
