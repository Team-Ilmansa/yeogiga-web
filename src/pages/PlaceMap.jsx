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
import addPlaceApi from '@/apis/map/addPlaceApi'

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
  /**임시로 추가된 장소 */
  const [savedPlaces, setSavedPlaces] = useState([])
  /**저장 장소 정보 */
  const [showSavedList, setShowSavedList] = useState(false)
  /**정보창 내용 변경(선택된 장소 or 저장된 장소 목록) */
  const [panelChanging, setPanelChanging] = useState(false)

  /**주소에서 여행 번호, 일차 가져오기 */
  const { tripId, day } = useParams()

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

  /**패널 상하 전환용 함수 */
  const switchPanelContent = (newContentType) => {
    setPanelChanging(true)

    setTimeout(() => {
      if (newContentType === 'saved') {
        setShowSavedList(true)
        setSelectedPlace(null)
      } else if (newContentType === 'selected') {
        setShowSavedList(false)
      }
      setPanelChanging(false)
    }, 300)
  }

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
          switchPanelContent('selected') // ↓ 내려갔다가 ↑ 다시 올라옴
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

  /**장소 임시저장을 위한 함수 */
  const handleAdd = () => {
    if (!selectedPlace) return

    /**중복 방지 */
    const alreadySaved = savedPlaces.some(
      (place) =>
        place.name === selectedPlace.name &&
        place.latitude === selectedPlace.latitude &&
        place.longitude === selectedPlace.longitude,
    )

    if (!alreadySaved) {
      setSavedPlaces((prev) => [...prev, selectedPlace])
    }
  }

  /**일정에 장소 등록을 위한 함수 */
  const handleConfirm = async () => {
    let successCount = 0

    for (const place of savedPlaces) {
      const body = {
        name: place.title,
        latitude: place.latitude,
        longitude: place.longitude,
        // 임시 구현
        placeType: 'ETC',
      }

      try {
        const result = await addPlaceApi(tripId, day, body)

        // 등록 성공 시 해당 place 제거
        setSavedPlaces((prev) => prev.filter((p) => p !== place))
        successCount += 1
      } catch (err) {
        if (err.code == 'T002') alert(`${place.title}: ${err.message}`)
        else alert(err.message)
      }
    }

    alert(`${successCount}개의 장소가 등록되었습니다.`)
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
      {/* <PlaceMapWithPin /> */}

      {/**정보창 + 플로팅 버튼 컨테이너 */}
      <div
        className={`fixed bottom-0 left-0 z-10 flex w-full justify-center transition-all duration-300 ${selectedPlace || showSavedList ? 'translate-y-0' : 'translate-y-full'} ${panelChanging ? 'pointer-events-none translate-y-[100%]' : 'opacity-100'} `}
      >
        <div className='relative w-4xl'>
          {/* 저장된 장소 수를 표시하는 플로팅 버튼 */}
          <div className='absolute -top-20 left-6 z-20'>
            <button
              onClick={() => switchPanelContent('saved')}
              className='relative flex h-12 w-12 items-center justify-center rounded-full border-none bg-white shadow-md'
            >
              <MapPin color={'var(--Grey-Scale-grey-400)'} size={30} />

              {savedPlaces.length > 0 && (
                <span className='absolute -top-1 -right-1 z-30 flex h-5 w-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--Blue-Scale-blue-500)] px-1 text-xs leading-none text-white'>
                  {savedPlaces.length}
                </span>
              )}
            </button>
          </div>

          <div className='flex flex-col gap-3 rounded-t-2xl border-t border-gray-300 bg-white p-10'>
            {showSavedList ? (
              savedPlaces.length > 0 ? (
                // 저장된 장소가 있을 때 목록 보여줌
                <div className='flex flex-col gap-3'>
                  <ul className='flex max-h-[200px] flex-col gap-10 overflow-y-auto'>
                    {savedPlaces.map((place, idx) => (
                      <li
                        key={idx}
                        className='flex items-center justify-between gap-4'
                      >
                        {/* 왼쪽 정보 */}
                        <div className='flex flex-col gap-1'>
                          <p className='text-3xl font-bold text-[var(--Grey-Scale-grey-400)]'>
                            {place.title}
                          </p>
                          <p className='text-base text-[var(--Grey-Scale-grey-400)]'>
                            {place.roadAddress || place.address}
                          </p>
                        </div>

                        {/* 삭제 버튼 */}
                        <button
                          onClick={() => {
                            setSavedPlaces((prev) =>
                              prev.filter((_, i) => i !== idx),
                            )
                          }}
                          className='border-none text-gray-300 transition-colors duration-200 hover:text-red-400'
                        >
                          <Trash
                            size={35}
                            color={'var(--Grey-Scale-grey-200)'}
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={handleConfirm}
                    className='mt-5 flex w-full items-center justify-center gap-2 border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
                  >
                    <span>
                      <PlusCalendar size={40} color={'white'} />
                    </span>
                    일정에 {savedPlaces.length}개의 장소 추가하기
                  </button>
                </div>
              ) : (
                // 저장된 장소 없을 때 대체 텍스트
                <div className='text-center text-lg text-[var(--Grey-Scale-grey-300)]'>
                  저장된 장소가 없습니다. <br />
                  장소를 선택한 후 "일정에 추가하기"를 눌러 저장하세요.
                </div>
              )
            ) : (
              // 마커 클릭 정보
              <>
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
                <button
                  onClick={handleAdd}
                  className='flex w-full items-center justify-center gap-2 border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
                >
                  <span>
                    <PlusCalendar size={40} color={'white'} />
                  </span>
                  일정에 추가하기
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceMap
