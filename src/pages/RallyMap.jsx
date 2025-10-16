import GoBack from '@/assets/sign-up/GoBack'
import { useEffect, useState } from 'react'
import Search from '../assets/map/Search'
import searchPlaceApi from '@/apis/map/searchPlaceApi'
import { ExternalLink } from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import createPinApi from '@/apis/pin/createPinApi'
import ReactDOMServer from 'react-dom/server'
import readPinApi from '@/apis/pin/readPinApi'
import PointPin from '@/assets/map/PointPin'

/**집결지 검색 및 등록을 위한 지도 화면 */
const RallyMap = () => {
  const navigate = useNavigate()

  /**검색어 */
  const [keyword, setKeyword] = useState('')
  /**지도 객체 */
  const [map, setMap] = useState(null)
  /**지도에 찍히는 마커 */
  const [markers, setMarkers] = useState([])
  /**마커가 클릭된 장소 */
  const [selectedPlace, setSelectedPlace] = useState(null)

  const [rallyPin, setRallyPin] = useState(null)

  /**집결 시간 설정 */
  const [noticeTime, setNoticeTime] = useState(() => {
    const pad = (n) => String(n).padStart(2, '0')
    const d = new Date()
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate(),
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  })

  const toLocalDateTimeString = (localDatetime) => {
    return localDatetime.length === 16 ? `${localDatetime}:00` : localDatetime
  }

  /**주소에서 여행 번호 가져오기*/
  const { tripId } = useParams()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const fetchRallyPin = async () => {
      try {
        const result = await readPinApi(tripId)
        if (result && result.data) {
          console.log('기존 집결지 정보:', result.data)
          setRallyPin(result.data)
        }
      } catch (error) {
        console.warn('기존 집결지를 불러오는 데 실패했습니다:', error.message)
      }
    }

    fetchRallyPin()
  }, [tripId])

  useEffect(() => {
    const initMap = (lat, lng) => {
      const mapOptions = {
        center: new window.naver.maps.LatLng(lat, lng),
        zoom: 15,
        minZoom: 7,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT,
        },
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: window.naver.maps.MapTypeControlStyle.BUTTON,
          position: window.naver.maps.Position.TOP_RIGHT,
        },
        mapTypeId: window.naver.maps.MapTypeId.NORMAL,
      }
      const map = new window.naver.maps.Map('map', mapOptions)
      setMap(map)
    }

    const latFromQuery = searchParams.get('lat')
    const lngFromQuery = searchParams.get('lng')

    if (latFromQuery && lngFromQuery) {
      initMap(parseFloat(latFromQuery), parseFloat(lngFromQuery))
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            initMap(latitude, longitude)
          },
          (error) => {
            console.error('위치 정보 가져오기 실패:', error)
            initMap(37.5665, 126.978)
          },
        )
      } else {
        initMap(37.5665, 126.978)
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (map && rallyPin) {
      const pinHTML = ReactDOMServer.renderToString(<PointPin />)

      const rallyPointMarker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(
          rallyPin.latitude,
          rallyPin.longitude,
        ),
        map: map,
        icon: {
          content: pinHTML,
          anchor: new window.naver.maps.Point(12, 25),
        },
        zIndex: 999,
      })

      const infoWindow = new window.naver.maps.InfoWindow({
        content: `
        <div style="padding: 10px; font-size: 14px; border-radius: 5px;">
          <b>${rallyPin.place}</b><br/>
          집결 시간: ${new Date(rallyPin.time).toLocaleString('ko-KR')}
        </div>
      `,
      })

      window.naver.maps.Event.addListener(rallyPointMarker, 'click', () => {
        if (infoWindow.getMap()) {
          infoWindow.close()
        } else {
          infoWindow.open(map, rallyPointMarker)
        }
      })
    }
  }, [map, rallyPin])

  useEffect(() => {
    if (!map) return

    const listener = window.naver.maps.Event.addListener(map, 'click', () => {
      setSelectedPlace(null)
    })

    return () => {
      window.naver.maps.Event.removeListener(listener)
    }
  }, [map])

  /**검색 시 실행 */
  const handleSearch = async (e) => {
    e.preventDefault()

    try {
      const result = await searchPlaceApi(keyword)

      markers.forEach((marker) => marker.setMap(null))

      const newMarkers = result.data.map((place) => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(
            place.latitude,
            place.longitude,
          ),
          map,
        })

        window.naver.maps.Event.addListener(marker, 'click', () => {
          setSelectedPlace(place)
        })

        return marker
      })

      if (result.data.length > 0) {
        const first = result.data[0]
        map.setCenter(
          new window.naver.maps.LatLng(first.latitude, first.longitude),
        )
        map.setZoom(16)
      }

      setMarkers(newMarkers)
    } catch (err) {
      console.error(err.message)
    }
  }

  /** 집결지 핀 생성 */
  const handleSetRally = async () => {
    if (!selectedPlace) return

    if (!noticeTime) {
      alert('집결 시간을 선택해 주세요.')
      return
    }

    const now = new Date()
    const chosen = new Date(noticeTime)
    const bufferedNow = new Date(now.getTime() + 5000)
    if (chosen < bufferedNow) {
      alert(
        '집결 시간은 현재 시각 이후여야 합니다. (몇 분 뒤로 설정해 주세요)',
      )
      return
    }

    const timeLocal = toLocalDateTimeString(noticeTime)

    try {
      const result = await createPinApi(tripId, {
        latitude: selectedPlace.latitude,
        longitude: selectedPlace.longitude,
        place:
          selectedPlace.title ||
          selectedPlace.name ||
          selectedPlace.roadAddress ||
          selectedPlace.address,
        time: timeLocal,
      })
      alert('집결지가 성공적으로 공지되었습니다!')
      console.log(result)
      navigate(`..`)
    } catch (err) {
      alert(err.message)
    }
  }

  // 선택 장소가 바뀌면 시간 초기화
  useEffect(() => {
    const pad = (n) => String(n).padStart(2, '0')
    const d = new Date()
    setNoticeTime(
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate(),
      )}T${pad(d.getHours())}:${pad(d.getMinutes())}`,
    )
  }, [selectedPlace])

  return (
    <div className='relative h-full w-full'>
      <div className='absolute top-4 left-4 z-10 flex items-center'>
        {/* 뒤로 가기 버튼 */}
        <button
          className='text-bold my-5 border-none px-8'
          onClick={() => navigate('..')}
        >
          <GoBack />
        </button>

        {/* 검색창 */}
        <form className='relative' onSubmit={handleSearch}>
          <input
            type='text'
            name='search'
            className='w-150 border-none bg-white px-[24px] py-[12px] shadow-[0_0_4px_0_rgba(0,0,0,0.1)]'
            onChange={(e) => setKeyword(e.target.value)}
            placeholder='장소를 검색해보세요'
          />
          <button
            type='submit'
            className='absolute top-1/2 right-4 -translate-y-1/2 border-none'
          >
            <Search color={'var(--Grey-Scale-grey-300)'} />
          </button>
        </form>
      </div>

      {/* 실제 지도 */}
      <div id='map' className='h-full w-full'></div>

      {/**정보창 */}
      <div
        className={`fixed bottom-0 left-0 z-10 flex w-full justify-center transition-all duration-300 ${
          selectedPlace ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className='relative w-4xl'>
          <div className='flex flex-col gap-3 rounded-t-2xl border-t border-gray-300 bg-white p-10'>
            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-1'>
                <h3 className='text-3xl font-bold text-[var(--Grey-Scale-grey-400)]'>
                  {selectedPlace?.title}
                </h3>
                {selectedPlace?.link && (
                  <a
                    href={selectedPlace?.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='mt-1 inline-block text-sm text-blue-500 underline'
                  >
                    <ExternalLink className='h-6 w-6 text-[var(--Grey-Scale-grey-200)]' />
                  </a>
                )}
              </div>
              <p className='text-base text-gray-600'>
                {selectedPlace?.roadAddress || selectedPlace?.address}
              </p>
            </div>

            <div className='mt-2 flex items-center gap-3 rounded-xl border border-[var(--Grey-Scale-grey-200)] bg-white px-4 py-3'>
              <label className='w-28 shrink-0 text-sm text-[var(--Grey-Scale-grey-300)]'>
                집결 시간
              </label>
              <input
                type='datetime-local'
                value={noticeTime}
                onChange={(e) => setNoticeTime(e.target.value)}
                className='w-full rounded-md border border-gray-200 px-3 py-2 text-gray-700 outline-none'
              />
            </div>

            <button
              onClick={handleSetRally}
              className='mt-3 flex w-full items-center justify-center gap-2 border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
            >
              이 장소를 집결지로 설정
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RallyMap
