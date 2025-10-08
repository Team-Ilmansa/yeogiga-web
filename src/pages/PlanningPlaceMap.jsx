import GoBack from '@/assets/sign-up/GoBack'
import PlaceMapWithPin from '@/components/trip/pin/PlaceMapWithPin'
import { useEffect, useState } from 'react'
import Search from '../assets/map/Search'
import searchPlaceApi from '@/apis/map/searchPlaceApi'
import { ExternalLink } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import PlusCalendar from '@/assets/map/PlusCalendar'
import MapPin from '@/assets/map/MapPin'
import Trash from '@/assets/map/Trash'
import createPinApi from '@/apis/pin/createPinApi'
import addPlanningPlaceApi from '@/apis/map/addPlanningPlaceApi'

/**목적지 검색을 위한 지도 화면 */
const PlanningPlaceMap = () => {
  const navigate = useNavigate()

  /**검색어 */
  const [keyword, setKeyword] = useState('')
  /**지도 객체 */
  const [map, setMap] = useState(null)
  /**지도에 찍히는 마커 */
  const [markers, setMarkers] = useState([])
  /**마커가 클릭된 장소 */
  const [selectedPlace, setSelectedPlace] = useState(null)

  /**집결지 공지 체크박스 상태 */
  /**집결지 공지 체크박스*/
  const [noticeAsPin, setNoticeAsPin] = useState(false)

  /**집결 시간 설정 */
  const [noticeTime, setNoticeTime] = useState(() => {
    const pad = (n) => String(n).padStart(2, '0')
    const d = new Date()
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  })

  const toLocalDateTimeString = (localDatetime) => {
    return localDatetime.length === 16 ? `${localDatetime}:00` : localDatetime
  }

  // 주소에서 여행 번호, 일차 가져오기
  const { tripId, day } = useParams()

  useEffect(() => {
    const scriptId = 'naver-maps-script'
    let mapScript = document.getElementById(scriptId)

    const initMap = (lat, lng) => {
      const mapOptions = {
        center: new window.naver.maps.LatLng(lat, lng),
        zoom: 13,
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
      const location = new window.naver.maps.LatLng(lat, lng)
      new window.naver.maps.Marker({
        position: location,
        map,
      })
    }

    const startMapInit = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            initMap(latitude, longitude)
          },
          (error) => {
            console.error('위치 정보 가져오기 실패:', error)
            initMap(37.5665, 126.978) // 실패 시 서울 시청 좌표
          },
        )
      } else {
        initMap(37.5665, 126.978)
      }
    }

    if (!mapScript) {
      mapScript = document.createElement('script')
      mapScript.id = scriptId
      mapScript.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${import.meta.env.VITE_NAVER_MAP_KEY}`
      mapScript.async = true
      mapScript.onload = startMapInit
      document.head.appendChild(mapScript)
    } else if (window.naver && window.naver.maps) {
      startMapInit()
    }
  }, [])

  // 지도 누르면 정보창 꺼지도록
  useEffect(() => {
    if (!map) return

    const listener = window.naver.maps.Event.addListener(map, 'click', () => {
      setSelectedPlace(null)
    })

    // 컴포넌트 언마운트 시 이벤트 제거
    return () => {
      window.naver.maps.Event.removeListener(listener)
    }
  }, [map])

  /**검색 시 실행 */
  const handleSearch = async (e) => {
    e.preventDefault()

    try {
      const result = await searchPlaceApi(keyword)

      // 기존 마커 삭제
      markers.forEach((marker) => marker.setMap(null))

      // 새 마커 생성
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

      // 검색된 첫 장소로 지도 중심 옮기기
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

  /** 집결지 핀 생성 or 일정 추가 */
  const handleAdd = async () => {
    if (!selectedPlace) return

    const body = {
      name: selectedPlace.title,
      latitude: selectedPlace.latitude,
      longitude: selectedPlace.longitude,
      // 임시 구현
      placeType: 'ETC',
    }

    try {
      const result = await addPlanningPlaceApi(tripId, day, body)
      console.log(result)
      alert('일정이 추가되었습니다!')
      navigate('..')
    } catch (err) {
      alert(err.message)
    }

    if (noticeAsPin) {
      if (!noticeTime) {
        alert('집결 시간을 선택해 주세요.')
        return
      }

      /** 버퍼 몇 초 추가(서버-클라이언트 시간차/전송지연 대응) */
      const now = new Date()
      const chosen = new Date(noticeTime)
      const bufferedNow = new Date(now.getTime() + 5000) // 5초 버퍼

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
      } catch (err) {
        alert(err.message)
      }
    }
  }

  // 선택 장소가 바뀌면 체크/시간 초기화
  useEffect(() => {
    setNoticeAsPin(false)
    const pad = (n) => String(n).padStart(2, '0')
    const d = new Date()
    setNoticeTime(
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`,
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
      {/* <PlanningPlaceMapWithPin /> */}

      {/**정보창 컨테이너 */}
      <div
        className={`fixed bottom-0 left-0 z-10 flex w-full justify-center transition-all duration-300 ${selectedPlace ? 'translate-y-0' : 'translate-y-full'} `}
      >
        <div className='flex flex-col gap-3 rounded-t-2xl border-t border-gray-300 bg-white p-10'>
          <div className='relative w-4xl'>
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

            {/* 집결지 공지하기 체크박스 */}
            <label className='mt-3 flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--Grey-Scale-grey-200)] bg-white px-4 py-3'>
              <input
                type='checkbox'
                className='h-5 w-5 accent-[var(--Blue-Scale-blue-500)]'
                checked={noticeAsPin}
                onChange={(e) => setNoticeAsPin(e.target.checked)}
              />
              <div className='flex flex-col'>
                <div className='flex items-center gap-2'>
                  <span className='rounded-md bg-yellow-300 px-2 py-[2px] text-xs font-semibold text-yellow-900'>
                    집결지
                  </span>
                  <span className='text-[14px] text-[var(--Grey-Scale-grey-300)]'>
                    공지하기
                  </span>
                </div>
                <span className='text-[13px] text-[var(--Grey-Scale-grey-300)]'>
                  이 장소를 팀의 집결지로 공지합니다.
                </span>
              </div>
            </label>
            {/**시간 설정 (집결지 공지하기 체크되었을 때만 표시) */}
            {noticeAsPin && (
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
            )}

            <button
              onClick={handleAdd}
              className='mt-3 flex w-full items-center justify-center gap-2 border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
            >
              <span>
                <PlusCalendar size={40} color={'white'} />
              </span>
              일정에 추가하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlanningPlaceMap
