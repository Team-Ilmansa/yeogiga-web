import getWeatherApi from '@/apis/home/getWeatherApi'
import ClearBackground from '@/assets/home/weather/ClearBackground.png'
import ClearIcon from '@/assets/home/weather/ClearIcon'
import CloudBackground from '@/assets/home/weather/CloudBackground.png'
import CloudIcon from '@/assets/home/weather/CloudIcon'
import RainBackground from '@/assets/home/weather/RainBackground.png'
import RainIcon from '@/assets/home/weather/RainIcon'
import SnowBackground from '@/assets/home/weather/SnowBackground.png'
import SnowIcon from '@/assets/home/weather/SnowIcon'
import WindBackground from '@/assets/home/weather/WindBackground.png'
import WindIcon from '@/assets/home/weather/WindIcon'
import { useEffect, useState } from 'react'

/**홈 화면 제목 */
const HomeTitle = ({ user }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const fetchWeather = async (latitude, longitude) => {
      try {
        const result = await getWeatherApi(latitude, longitude)
        setWeather(result)
        console.log('Weather data:', result)
      } catch (err) {
        alert('날씨 정보를 가져오는 데 실패했습니다: ' + err.message)
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          fetchWeather(latitude, longitude)
        },
        (error) => {
          console.error('Geolocation error:', error)
          alert(
            '현재 위치를 가져올 수 없습니다. 날씨 정보를 위해 기본 위치(서울)를 사용합니다.',
          )
          fetchWeather(37.5665, 126.978)
        },
      )
    } else {
      alert(
        '이 브라우저에서는 위치 정보를 지원하지 않습니다. 기본 위치(서울)의 날씨를 표시합니다.',
      )
      fetchWeather(37.5665, 126.978)
    }
  }, [])

  const getWeatherCondition = () => {
    if (!weather) return null

    const pty = weather.PTY
    const sky = weather.SKY
    const wsd = weather.WSD

    if (pty === '3')
      return { text: '눈', Icon: SnowIcon, background: SnowBackground }
    if (pty === '1' || pty === '2' || pty === '4')
      return { text: '비', Icon: RainIcon, background: RainBackground }
    if (sky === '3' || sky === '4')
      return { text: '구름', Icon: CloudIcon, background: CloudBackground }
    if (sky === '1')
      return { text: '맑음', Icon: ClearIcon, background: ClearBackground }
    if (parseFloat(wsd) > 4)
      return { text: '바람', Icon: WindIcon, background: WindBackground }

    return null
  }

  const weatherCondition = getWeatherCondition()
  const WeatherIcon = weatherCondition?.Icon
  const iconColor = weatherCondition?.text === '비' ? 'white' : 'black'

  const backgroundStyle = weatherCondition
    ? {
        minHeight: '20rem',
        backgroundImage: `linear-gradient(to bottom, transparent, #fafafa), url(${weatherCondition.background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
      }
    : {}

  return (
    <div
      className='flex flex-col gap-1 pt-10 pl-10 text-4xl/[1.4] font-bold'
      style={backgroundStyle}
    >
      <div
        className={`flex items-center gap-2 text-[var(--Grey-Scale-grey-400)]`}
      >
        {weatherCondition && (
          <div
            className='flex items-center gap-1 rounded-full pb-10 text-lg'
            title={`풍속: ${weather.WSD} m/s`}
          >
            <WeatherIcon color={iconColor} />
            {weather && weather.TMP && (
              <span className={`text-${iconColor} px-1 text-2xl font-medium`}>
                {weather.TMP}°
              </span>
            )}
          </div>
        )}
      </div>
      <div>{user?.nickname}님,</div>
      <div>여행 계획 있으신가요?</div>
    </div>
  )
}

export default HomeTitle
