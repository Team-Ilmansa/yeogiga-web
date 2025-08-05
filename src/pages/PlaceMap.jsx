import GoBack from '@/assets/sign-up/GoBack'
import PlaceMapWithPin from '@/components/trip/pin/PlaceMapWithPin'
import { useEffect, useState } from 'react'
import Search from '../assets/map/Search'
import searchPlaceApi from '@/apis/map/searchPlaceApi'
import { ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PlusCalendar from '@/assets/map/PlusCalendar'

/**목적지 검색을 위한 지도 화면 */
const PlaceMap = () => {
  const navigate = useNavigate()

  /**검색어 */
  const [keyword, setKeyword] = useState('')
  /**지도 객체 */
  const [map, setMap] = useState(null)
  /**지도에 찍히는 마커 */
  const [markers, setMarkers] = useState([])
  /**마커가 클릭된 장소 */
  const [selectedPlace, setSelectedPlace] = useState(null)

  useEffect(() => {
    /**지도 생성 함수 */
    const initMap = (lat, lng) => {
      /**지도 옵션 설정 */
      const mapOptions = {
        center: new naver.maps.LatLng(lat, lng),
        zoom: 13,
        minZoom: 7,
        zoomControl: true,
        zoomControlOptions: {
          position: naver.maps.Position.TOP_RIGHT,
        },
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: naver.maps.MapTypeControlStyle.BUTTON,
          position: naver.maps.Position.TOP_RIGHT,
        },
        mapTypeId: naver.maps.MapTypeId.NORMAL,
      }

      /**지도 객체 생성 및 저장 */
      const map = new naver.maps.Map('map', mapOptions)
      setMap(map)

      /**마커 생성 */
      const location = new naver.maps.LatLng(lat, lng)
      new naver.maps.Marker({
        position: location,
        map,
      })
    }

    // 현위치 가져오기
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
  }, [])

  // 지도 누르면 정보창 꺼지도록
  useEffect(() => {
    if (!map) return

    const listener = naver.maps.Event.addListener(map, 'click', () => {
      setSelectedPlace(null)
    })

    // 컴포넌트 언마운트 시 이벤트 제거
    return () => {
      naver.maps.Event.removeListener(listener)
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
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(place.latitude, place.longitude),
          map,
        })

        naver.maps.Event.addListener(marker, 'click', () => {
          setSelectedPlace(place)
        })

        return marker
      })

      // 검색된 첫 장소로 지도 중심 옮기기
      if (result.data.length > 0) {
        const first = result.data[0]
        map.setCenter(new naver.maps.LatLng(first.latitude, first.longitude))
        map.setZoom(16)
      }

      setMarkers(newMarkers)
    } catch (err) {
      console.error(err.message)
    }
  }

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
      <PlaceMapWithPin />

      {/* 마커 클릭 시 열리는 정보창 */}
      <div
        className={`absolute bottom-0 left-0 z-10 flex w-full transform flex-col gap-5 rounded-t-2xl border-t border-gray-300 bg-white p-10 transition-transform duration-300 ${selectedPlace ? 'translate-y-0' : 'translate-y-full'}`}
      >
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
        <button className='flex w-full items-center justify-center gap-2 border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'>
          <span>
            <PlusCalendar size={40} color={'white'} />
          </span>
          일정에 추가하기
        </button>
      </div>
    </div>
  )
}

export default PlaceMap
