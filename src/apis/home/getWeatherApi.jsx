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
      const closestTime = availableTimes
        .slice()
        .reverse()
        .find((t) => hours >= t)
      base_time = `${String(closestTime).padStart(2, '0')}00`
    }

    const { x, y } = dfs_xy_conv('toXY', latitude, longitude)

    const response = await axios.get(
      'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst',
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

    let earliestFcstDate = ''
    let earliestFcstTime = ''

    if (items && items.length > 0) {
      earliestFcstDate = items[0].fcstDate
      earliestFcstTime = items[0].fcstTime

      for (const item of items) {
        if (
          item.fcstDate < earliestFcstDate ||
          (item.fcstDate === earliestFcstDate &&
            item.fcstTime < earliestFcstTime)
        ) {
          earliestFcstDate = item.fcstDate
          earliestFcstTime = item.fcstTime
        }
      }
    }

    const forecastForEarliestHour = items.filter(
      (item) =>
        item.fcstDate === earliestFcstDate &&
        item.fcstTime === earliestFcstTime,
    )

    if (forecastForEarliestHour.length === 0) {
      console.warn(`No forecast data found for the earliest time slot.`)
      return {}
    }

    const weatherData = {}
    forecastForEarliestHour.forEach((item) => {
      weatherData[item.category] = item.fcstValue
    })
    weatherData.fcstTime = earliestFcstTime

    console.log(`Filtered weather for ${earliestFcstTime}:`, weatherData)
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
