import GoBack from '@/assets/sign-up/GoBack'
import { useEffect, useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import readPlanningDatePlaceApi from '@/apis/planning-dashboard/readPlanningDatePlaceApi'
import readPlaceInfoApi from '@/apis/map/readPlaceInfoApi'
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import FixedActionBar from '@/components/common/FixedActionBar'
import { useTripInfo } from '@/hooks/useTripInfo'
import readDatePlaceApi from '@/apis/dashboard/readDatePlaceApi'
import ReactDOMServer from 'react-dom/server'
import PointPin from '@/assets/map/PointPin'
import TouristIcon from '@/assets/map/category/TouristIcon'
import LodgingIcon from '@/assets/map/category/LodgingIcon'
import MealIcon from '@/assets/map/category/MealIcon'
import TransportIcon from '@/assets/map/category/TransportIcon'
import EtcIcon from '@/assets/map/category/EtcIcon'
import readMatchedImagesApi from '@/apis/image/readMatchedImagesApi'

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

// Custom Overlay Class Definition
function ImageOverlay(options) {
  this._position = options.position
  this._element = options.element

  this.setMap(options.map || null)
}

ImageOverlay.prototype = new window.naver.maps.OverlayView()
ImageOverlay.prototype.constructor = ImageOverlay

ImageOverlay.prototype.onAdd = function () {
  this.getPanes().overlayLayer.appendChild(this._element)
}

ImageOverlay.prototype.draw = function () {
  if (!this.getMap()) {
    return
  }

  const projection = this.getProjection()
  const position = this.getPosition()
  const pixelPosition = projection.fromCoordToOffset(position)

  this._element.style.position = 'absolute'
  this._element.style.left = `${pixelPosition.x}px`
  this._element.style.top = `${pixelPosition.y}px`
}

ImageOverlay.prototype.onRemove = function () {
  if (this._element.parentElement) {
    this._element.parentElement.removeChild(this._element)
  }
}

ImageOverlay.prototype.getPosition = function () {
  return this._position
}

/** 저장된 목적지들을 보여주는 지도 화면 */
const TripPlaceMap = ({
  showBackButton = true,
  focusOnSelected = true,
  showFixedActionBar = true,
  initialZoom = 16,
}) => {
  const navigate = useNavigate()
  const { tripInfo } = useTripInfo()
  const tripId = tripInfo?.tripId

  const [map, setMap] = useState(null)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [places, setPlaces] = useState([])
  const markersRef = useRef([])
  const imageOverlayRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dayFilter, setDayFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  // 여행 정보 및 장소들 가져오기
  useEffect(() => {
    if (!tripId || !tripInfo) return

    const fetchTripPlaces = async () => {
      setIsLoading(true)
      try {
        let allPlaces = []
        if (tripInfo.status === 'COMPLETED') {
          const placeSummariesResponse = await readPlanningDatePlaceApi(tripId)
          const allPlacesPromises = placeSummariesResponse.data.map(
            async (summary) => {
              const placeDetails = await readPlaceInfoApi(tripId, summary.id)
              const placesWithImages = await Promise.all(
                placeDetails.data.map(async (p) => {
                  const imagesResponse = await readMatchedImagesApi(
                    tripId,
                    summary.id,
                    p.id,
                  )
                  return {
                    ...p,
                    day: summary.day,
                    images: imagesResponse.data.images || [],
                  }
                }),
              )
              return placesWithImages
            },
          )
          const allPlacesArrays = await Promise.all(allPlacesPromises)
          allPlaces = allPlacesArrays.flat()
        } else if (tripInfo.status === 'SETTING') {
          const startDate = new Date(tripInfo.startedAt)
          const endDate = new Date(tripInfo.endedAt)
          const dayCount = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1

          const allPlacesPromises = Array.from({ length: dayCount }, (_, i) => {
            const day = i + 1
            return readDatePlaceApi(tripId, day).then((response) =>
              response.data.map((place) => ({ ...place, day })),
            )
          })
          const allPlacesArrays = await Promise.all(allPlacesPromises)
          allPlaces = allPlacesArrays.flat()
        } else {
          const placeSummariesResponse = await readPlanningDatePlaceApi(tripId)
          const allPlacesPromises = placeSummariesResponse.data.map(
            async (summary) => {
              const placeDetails = await readPlaceInfoApi(tripId, summary.id)
              return placeDetails.data.map((p) => ({ ...p, day: summary.day }))
            },
          )
          const allPlacesArrays = await Promise.all(allPlacesPromises)
          allPlaces = allPlacesArrays.flat()
        }
        setPlaces(allPlaces)
      } catch (error) {
        console.error('Failed to fetch trip places:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTripPlaces()
  }, [tripId, tripInfo])

  // 지도 초기화
  useEffect(() => {
    const scriptId = 'naver-maps-script'
    let mapScript = document.getElementById(scriptId)

    const initMap = (lat, lng) => {
      const mapOptions = {
        center: new window.naver.maps.LatLng(lat, lng),
        zoom: initialZoom,
        minZoom: 7,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT,
        },
      }
      const mapInstance = new window.naver.maps.Map('map', mapOptions)
      setMap(mapInstance)
    }

    const startMapInit = () => {
      if (!isLoading) {
        if (places.length > 0) {
          const firstPlace = places[0]
          initMap(firstPlace.latitude, firstPlace.longitude)
        } else {
          // Fallback if no places
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) =>
                initMap(position.coords.latitude, position.coords.longitude),
              () => initMap(37.5665, 126.978), // Seoul
            )
          } else {
            initMap(37.5665, 126.978) // Seoul
          }
        }
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
  }, [places, isLoading, initialZoom])

  const filteredPlaces = useMemo(
    () => places.filter((p) => dayFilter === 'all' || p.day === dayFilter),
    [places, dayFilter],
  )

  useEffect(() => {
    if (filteredPlaces.length > 0) {
      setCurrentIndex(0)
      setSelectedPlace(filteredPlaces[0])
    } else {
      setSelectedPlace(null)
    }
  }, [dayFilter, places, filteredPlaces])

  // 지도에 장소 마커 표시
  useEffect(() => {
    if (!map) return

    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    if (filteredPlaces.length === 0) {
      return
    }

    const newMarkers = filteredPlaces.map((place) => {
      const pinHTML = ReactDOMServer.renderToString(<PointPin />)
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(place.latitude, place.longitude),
        map: map,
        icon: {
          content: pinHTML,
          anchor: new window.naver.maps.Point(25, 25),
        },
      })

      window.naver.maps.Event.addListener(marker, 'click', () => {
        setSelectedPlace(place)
        const placeIndex = filteredPlaces.findIndex((p) => p.id === place.id)
        if (placeIndex !== -1) {
          setCurrentIndex(placeIndex)
        }
      })

      return marker
    })

    markersRef.current = newMarkers

    // 선택된 장소에 포커싱하지 않을 때(임베디드 지도) : 모든 마커가 보이도록 지도 범위 조정
    if (!focusOnSelected && filteredPlaces.length > 0) {
      const bounds = new window.naver.maps.LatLngBounds()
      filteredPlaces.forEach((place) => {
        bounds.extend(
          new window.naver.maps.LatLng(place.latitude, place.longitude),
        )
      })
      map.fitBounds(bounds)
    }
  }, [map, filteredPlaces, focusOnSelected])

  // 이미지 오버레이 관리
  useEffect(() => {
    if (imageOverlayRef.current) {
      imageOverlayRef.current.setMap(null)
    }

    if (
      map &&
      selectedPlace &&
      selectedPlace.images &&
      selectedPlace.images.length > 0
    ) {
      const radius = 100 // 핀으로부터의 거리
      const imagesToShow = selectedPlace.images.slice(0, 5)
      const numImages = imagesToShow.length

      const container = document.createElement('div')
      container.style.position = 'relative'

      imagesToShow.forEach((image, i) => {
        const angle = (i * (360 / numImages) - 90) * (Math.PI / 180) // 위쪽부터 시작
        const x = radius * Math.cos(angle)
        const y = radius * Math.sin(angle)

        const img = document.createElement('img')
        img.src = image.url
        img.style.position = 'absolute'
        img.style.left = `${x}px`
        img.style.top = `${y}px`
        img.style.minWidth = '80px'
        img.style.height = '80px'
        img.style.borderRadius = '50%'
        img.style.border = '2px solid white'
        img.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)'
        img.style.transform = 'translate(-50%, -50%)'
        img.style.boxSizing = 'content-box' // 너비 문제 해결
        container.appendChild(img)
      })

      imageOverlayRef.current = new ImageOverlay({
        map: map,
        position: new window.naver.maps.LatLng(
          selectedPlace.latitude,
          selectedPlace.longitude,
        ),
        element: container,
      })
    }
  }, [map, selectedPlace])

  //  선택된 장소로 지도 포커스
  useEffect(() => {
    if (!map || !selectedPlace || !focusOnSelected) return
    map.panTo(
      new window.naver.maps.LatLng(
        selectedPlace.latitude,
        selectedPlace.longitude,
      ),
    )
    map.setZoom(16, true)
  }, [map, selectedPlace, focusOnSelected])
  const goToPreviousPlace = () => {
    if (filteredPlaces.length > 0) {
      const newIndex =
        currentIndex === 0 ? filteredPlaces.length - 1 : currentIndex - 1
      setCurrentIndex(newIndex)
      setSelectedPlace(filteredPlaces[newIndex])
    }
  }

  const goToNextPlace = () => {
    if (filteredPlaces.length > 0) {
      const newIndex =
        currentIndex === filteredPlaces.length - 1 ? 0 : currentIndex + 1
      setCurrentIndex(newIndex)
      setSelectedPlace(filteredPlaces[newIndex])
    }
  }

  const dayCount = places.reduce((max, p) => (p.day > max ? p.day : max), 0)
  const tabs = [
    '여행 전체',
    ...Array.from({ length: dayCount }, (_, i) => `DAY ${i + 1}`),
  ]

  const SelectedIcon = selectedPlace
    ? categoryIcons[selectedPlace.placeType] || EtcIcon
    : EtcIcon
  const selectedColor = selectedPlace
    ? categoryColors[selectedPlace.placeType] || '#C161EE'
    : '#C161EE'

  return (
    <div className='relative h-full w-full'>
      {showBackButton && (
        <div className='absolute top-4 left-4 z-10 flex items-center'>
          <button
            className='text-bold my-5 border-none px-8'
            onClick={() => navigate(-1)}
          >
            <GoBack />
          </button>
        </div>
      )}

      <div
        id='map'
        className={`h-full w-full ${isLoading ? 'invisible' : ''}`}
      ></div>
      {isLoading && (
        <div className='bg-opacity-50 absolute inset-0 flex items-center justify-center bg-white'>
          <p>Loading map...</p>
        </div>
      )}

      {!isLoading && places.length > 0 && showFixedActionBar && (
        <FixedActionBar className='flex justify-center'>
          <div className='w-4xl rounded-t-[20px] bg-white p-2 shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
            <div className='flex flex-wrap gap-[6px] p-3'>
              {tabs.map((tab, index) => {
                const day = index === 0 ? 'all' : index
                const isActive = dayFilter === day
                return (
                  <div
                    key={tab}
                    onClick={() => setDayFilter(day)}
                    className={`cursor-pointer rounded-full px-4 py-1 text-base ${
                      isActive
                        ? 'bg-[var(--Blue-Scale-blue-500)] text-white'
                        : 'border border-gray-300 bg-white text-gray-500'
                    }`}
                  >
                    {tab}
                  </div>
                )
              })}
            </div>
            {selectedPlace && (
              <div className='flex items-center justify-between pb-5'>
                <button
                  onClick={goToPreviousPlace}
                  className='rounded-full border-none p-2 hover:bg-gray-100'
                >
                  <ChevronLeft />
                </button>
                <div className='mx-4 flex flex-1 items-center gap-5'>
                  <div className='flex h-10 w-10 cursor-grab items-center justify-center rounded-full'>
                    <SelectedIcon size={40} color={selectedColor} />
                  </div>
                  <div className='flex w-full justify-between rounded-2xl bg-[var(--Grey-Scale-grey-100)] p-5 text-base text-[var(--Grey-Scale-grey-300)]'>
                    <span>{selectedPlace.name}</span>
                  </div>
                  {selectedPlace.link && (
                    <a
                      href={selectedPlace.link}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <ExternalLink className='h-6 w-6 text-[var(--Grey-Scale-grey-400)]' />
                    </a>
                  )}
                </div>
                <button
                  onClick={goToNextPlace}
                  className='rounded-full border-none p-2 hover:bg-gray-100'
                >
                  <ChevronRight />
                </button>
              </div>
            )}
          </div>
        </FixedActionBar>
      )}
    </div>
  )
}

export default TripPlaceMap
