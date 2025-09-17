import { weatherApiKey } from '@/config/Env'
import axios from 'axios'

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

/**날씨 오픈 API */
const getWeatherApi = async (latitude, longitude) => {
  try {
    const now = new Date()
    const hours = now.getHours()
    let base_date
    let base_time

    // API 발표 시간을 감안하여, 새벽 3시 이전에는 전날 23시 예보를 사용합니다.
    if (hours < 3) {
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const year = yesterday.getFullYear()
      const month = String(yesterday.getMonth() + 1).padStart(2, '0')
      const day = String(yesterday.getDate()).padStart(2, '0')
      base_date = `${year}${month}${day}`
      base_time = '2300'
    } else {
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      base_date = `${year}${month}${day}`

      const availableTimes = [2, 5, 8, 11, 14, 17, 20, 23]
      // 현재 시간보다 작거나 같은 예보 시간 중 가장 가까운 시간을 찾습니다.
      const closestTime = availableTimes
        .slice()
        .reverse()
        .find((t) => hours >= t)
      base_time = `${String(closestTime).padStart(2, '0')}00`
    }

    const { x, y } = dfs_xy_conv('toXY', latitude, longitude)

    const response = await axios.get(
      'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst',
      {
        params: {
          serviceKey: weatherApiKey,
          pageNo: 1,
          numOfRows: 1000,
          dataType: 'JSON',
          base_date: base_date,
          base_time: base_time,
          nx: x,
          ny: y,
        },
      },
    )
    console.log('Full API Response:', response.data)

    const items = response.data.response.body.items.item
    const currentHourStr = String(now.getHours()).padStart(2, '0') + '00'
    const currentDateStr = `${now.getFullYear()}${String(
      now.getMonth() + 1,
    ).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`

    const forecastForCurrentHour = items.filter(
      (item) =>
        item.fcstDate === currentDateStr && item.fcstTime === currentHourStr,
    )

    // 현재 시간에 대한 예보 데이터가 없는 경우, 빈 객체를 반환합니다.
    if (forecastForCurrentHour.length === 0) {
      console.warn(
        `No forecast data found for ${currentDateStr} ${currentHourStr}.`,
      )
      return {}
    }

    // 찾은 예보들을 카테고리별로 정리된 객체 하나로 만듭니다.
    const weatherData = {}
    forecastForCurrentHour.forEach((item) => {
      weatherData[item.category] = item.fcstValue
    })
    weatherData.fcstTime = currentHourStr // 예보 시간 정보 추가

    console.log(`Filtered weather for ${currentHourStr}:`, weatherData)
    return weatherData
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
