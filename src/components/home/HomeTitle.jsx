import getWeatherApi from '@/apis/home/getWeatherApi'
import readMainTripApi from '@/apis/trip/readMainApi'
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
import EtcIcon from '@/assets/map/category/EtcIcon'
import LodgingIcon from '@/assets/map/category/LodgingIcon'
import MealIcon from '@/assets/map/category/MealIcon'
import TouristIcon from '@/assets/map/category/TouristIcon'
import TransportIcon from '@/assets/map/category/TransportIcon'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const categoryIcons = {
  관광지: TouristIcon,
  숙소: LodgingIcon,
  식당: MealIcon,
  이동수단: TransportIcon,
  기타: EtcIcon,
}

const categoryColors = {
  관광지: '#F87C7C',
  숙소: '#66CD7A',
  식당: '#8CB6E8',
  이동수단: '#F19B55',
  기타: '#C161EE',
}

/**홈 화면 제목 */
const HomeTitle = ({ user }) => {
  const [weather, setWeather] = useState(null)
  const [mainTrip, setMainTrip] = useState(null)
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false)
  const [isButtonExpanded, setIsButtonExpanded] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchWeather = async (latitude, longitude) => {
      try {
        const result = await getWeatherApi(latitude, longitude)
        setWeather(result.data)
      } catch (err) {
        console.error(err)
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

    const fetchMainTrip = async () => {
      try {
        const result = await readMainTripApi()
        setMainTrip(result.data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchMainTrip()
  }, [])

  useEffect(() => {
    if (isScheduleExpanded) {
      setIsButtonExpanded(true)
    } else {
      const timer = setTimeout(() => {
        setIsButtonExpanded(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isScheduleExpanded])

  /**카테고리 별 값 읽어오기 */
  const getWeatherValue = (category) => {
    if (!weather) return null
    const item = weather.find((item) => item.category === category)
    return item ? item.fcstValue : null
  }

  /**날씨 종류 판단 */
  const getWeatherCondition = () => {
    if (!weather) return null

    const pty = getWeatherValue('PTY')
    const sky = getWeatherValue('SKY')
    const wsd = getWeatherValue('WSD')

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

    return { text: '맑음', Icon: ClearIcon, background: ClearBackground }
  }

  const getTripStatusMessage = () => {
    if (!mainTrip) {
      return '여행 계획 있으신가요?'
    }

    switch (mainTrip.travelStatus) {
      case 'PLANNED': {
        const today = new Date()
        const startDate = new Date(mainTrip.staredAt)
        today.setHours(0, 0, 0, 0)
        startDate.setHours(0, 0, 0, 0)
        const diffTime = startDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return `여행이 ${diffDays}일 남았어요!`
      }
      case 'IN_PROGRESS':
        return `여행 ${mainTrip.day}일차에요!`
      default:
        return '여행 계획 있으신가요?'
    }
  }

  const weatherCondition = getWeatherCondition()
  const WeatherIcon = weatherCondition?.Icon
  const iconColor = weatherCondition?.text === '비' ? 'white' : 'black'
  const tmp = getWeatherValue('TMP')
  const wsd = getWeatherValue('WSD')

  const backgroundStyle = weatherCondition
    ? {
        minHeight: '20rem',
        backgroundImage: `linear-gradient(to bottom, transparent, #fafafa), url(${weatherCondition.background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {}

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}월 ${date.getDate()}일`
  }

  const getScheduleTitle = () => {
    if (!mainTrip) return ''
    if (mainTrip.travelStatus === 'PLANNED') {
      return `${formatDate(mainTrip.staredAt)} 여행 첫날의 일정`
    }
    if (mainTrip.travelStatus === 'IN_PROGRESS') {
      const today = new Date()
      return `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 오늘의 일정`
    }
    return ''
  }

  return (
    <div
      className='flex flex-col gap-1 px-10 pt-10 text-4xl/[1.4] font-bold'
      style={backgroundStyle}
    >
      <div
        className={`flex items-center gap-2 text-[var(--Grey-Scale-grey-400)]`}
      >
        {weatherCondition && (
          <div
            className='flex items-center gap-1 rounded-full pb-10 text-lg'
            title={`풍속: ${wsd} m/s`}
          >
            <WeatherIcon color={iconColor} />
            {tmp && (
              <span className={`text-${iconColor} px-1 text-2xl font-medium`}>
                {tmp}°
              </span>
            )}
          </div>
        )}
      </div>
      <div>{user?.nickname}님,</div>
      <div>{getTripStatusMessage()}</div>

      {(mainTrip?.travelStatus === 'PLANNED' ||
        mainTrip?.travelStatus === 'IN_PROGRESS') && (
        <div
          className='relative mt-4 mr-4 cursor-pointer rounded-xl bg-white p-6 pb-10 text-base font-normal shadow-lg'
          onClick={() => navigate(`/trip/${mainTrip.tripId}`)}
        >
          <div className='mb-3 text-lg text-[var(--Grey-Scale-grey-300)]'>
            {getScheduleTitle()}
          </div>
          {mainTrip.places.length > 0 ? (
            <>
              <div className='relative'>
                <ul
                  className={`space-y-3 overflow-hidden transition-[max-height] duration-500 ease-in-out ${isScheduleExpanded ? 'max-h-1000' : 'max-h-60'}`}
                >
                  {mainTrip.places.map((place) => {
                    const Icon = categoryIcons[place.placeType] || EtcIcon
                    const color = categoryColors[place.placeType] || '#C161EE'

                    return (
                      <li
                        key={place.id}
                        className='flex items-center justify-start gap-5'
                      >
                        <div className='flex h-10 w-10 items-center justify-center rounded-full'>
                          <Icon size={40} color={color} />
                        </div>
                        <div className='flex w-full justify-between rounded-2xl bg-[var(--Grey-Scale-grey-100)] p-5 text-base text-[var(--Grey-Scale-grey-300)]'>
                          <span>{place.name}</span>
                        </div>
                      </li>
                    )
                  })}
                </ul>
                {mainTrip.places.length > 3 && (
                  <div
                    className={`pointer-events-none absolute right-0 bottom-0 left-0 h-24 bg-gradient-to-t from-white to-transparent transition-opacity duration-300 ${isScheduleExpanded ? 'opacity-0' : 'opacity-100 delay-300'}`}
                  ></div>
                )}
              </div>
              {mainTrip.places.length > 3 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsScheduleExpanded(!isScheduleExpanded)
                  }}
                  className='│ │ absolute bottom-0 left-1/2 flex -translate-x-1/2 translate-y-1/2 transform items-center gap-1 rounded-full bg-[var(--Blue-Scale-blue-500)] px-6 py-2 text-base text-white'
                >
                  <span>{isButtonExpanded ? '일정 접기' : '일정 펼치기'}</span>
                  {isButtonExpanded ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
              )}
            </>
          ) : (
            <div className='text-center text-gray-500'>
              일정이 아직 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default HomeTitle
