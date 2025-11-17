import GoBack from '@/assets/sign-up/GoBack'
import { useEffect, useState, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import readPlanningDatePlaceApi from '@/apis/planning-dashboard/readPlanningDatePlaceApi'
import readPlaceInfoApi from '@/apis/map/readPlaceInfoApi'
import {
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'
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

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? '오후' : '오전'
  hours = hours % 12
  hours = hours ? hours : 12
  hours = String(hours).padStart(2, '0')

  return `${year}.${month}.${day} ${ampm} ${hours}:${minutes}`
}

/** 저장된 목적지들을 보여주는 지도 화면 */
const TripPlaceMap = ({
  showBackButton = true,
  focusOnSelected = true,
  showFixedActionBar = true,
  initialZoom = 16,
  dayFilter: externalDayFilter,
  onMapClick,
}) => {
  const navigate = useNavigate()
  const { tripInfo } = useTripInfo()
  const tripId = tripInfo?.tripId

  const [map, setMap] = useState(null)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [places, setPlaces] = useState([])
  const markersRef = useRef([])
  const polylinesRef = useRef([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dayFilter, setDayFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [modalImages, setModalImages] = useState([])

  const openModal = (image, images) => {
    const imagesWithPlaceName = images.map((img) => ({
      ...img,
      placeName: selectedPlace.name,
    }))
    setModalImages(imagesWithPlaceName)
    setSelectedImage(imagesWithPlaceName.find((img) => img.id === image.id))
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedImage(null)
    setModalImages([])
  }

  const showNextImage = (e) => {
    if (e) e.stopPropagation()
    const currentIndex = modalImages.findIndex(
      (img) => img.id === selectedImage.id,
    )
    const nextIndex = (currentIndex + 1) % modalImages.length
    setSelectedImage(modalImages[nextIndex])
  }

  const showPrevImage = (e) => {
    if (e) e.stopPropagation()
    const currentIndex = modalImages.findIndex(
      (img) => img.id === selectedImage.id,
    )
    const prevIndex =
      (currentIndex - 1 + modalImages.length) % modalImages.length
    setSelectedImage(modalImages[prevIndex])
  }

  const effectiveDayFilter =
    externalDayFilter === undefined ? dayFilter : externalDayFilter

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

      if (onMapClick) {
        window.naver.maps.Event.addListener(mapInstance, 'click', () => {
          onMapClick()
        })
      }

      setMap(mapInstance)
    }

    const startMapInit = () => {
      if (!isLoading) {
        if (places.length > 0) {
          const firstPlace = places[0]
          initMap(firstPlace.latitude, firstPlace.longitude)
        } else {
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
      mapScript.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${
        import.meta.env.VITE_NAVER_MAP_KEY
      }`
      mapScript.async = true
      mapScript.onload = startMapInit
      document.head.appendChild(mapScript)
    } else if (window.naver && window.naver.maps) {
      startMapInit()
    }
  }, [places, isLoading, initialZoom, onMapClick])

  const filteredPlaces = useMemo(
    () =>
      places.filter(
        (p) => effectiveDayFilter === 'all' || p.day === effectiveDayFilter,
      ),
    [places, effectiveDayFilter],
  )

  useEffect(() => {
    if (filteredPlaces.length > 0) {
      setCurrentIndex(0)
      setSelectedPlace(filteredPlaces[0])
    } else {
      setSelectedPlace(null)
    }
  }, [effectiveDayFilter, filteredPlaces])

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

  useEffect(() => {
    if (!map) return

    polylinesRef.current.forEach((polyline) => polyline.setMap(null))
    polylinesRef.current = []

    if (filteredPlaces.length < 2) return

    const dayColors = [
      '#4497fd',
      '#ff8724',
      '#44ed66',
      '#b13ce7',
      '#3239c8',
      '#ff5387',
      '#45acdc',
    ]

    if (effectiveDayFilter === 'all') {
      const byDay = filteredPlaces.reduce((acc, place) => {
        const day = place.day ?? 0
        if (!acc[day]) acc[day] = []
        acc[day].push(place)
        return acc
      }, {})

      const dayKeys = Object.keys(byDay)
        .map((k) => Number(k))
        .sort((a, b) => a - b)

      let prevLastCoord = null

      dayKeys.forEach((dayKey, index) => {
        const placesOfDay = byDay[dayKey]
        if (!placesOfDay || placesOfDay.length === 0) return

        const coords = placesOfDay.map(
          (p) => new window.naver.maps.LatLng(p.latitude, p.longitude),
        )

        const path = prevLastCoord != null ? [prevLastCoord, ...coords] : coords

        const polyline = new window.naver.maps.Polyline({
          map,
          path,
          strokeColor: dayColors[index % dayColors.length],
          strokeOpacity: 0.9,
          strokeWeight: 4,
        })

        polylinesRef.current.push(polyline)

        prevLastCoord = coords[coords.length - 1]
      })
    } else {
      const path = filteredPlaces.map(
        (p) => new window.naver.maps.LatLng(p.latitude, p.longitude),
      )

      const polyline = new window.naver.maps.Polyline({
        map,
        path,
        strokeColor: '#8287FF',
        strokeOpacity: 0.9,
        strokeWeight: 4,
      })

      polylinesRef.current.push(polyline)
    }
  }, [map, filteredPlaces, effectiveDayFilter])

  // 선택된 장소로 지도 포커스
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
            <div className='mb-2 flex flex-wrap gap-[6px] p-2'>
              {tabs.map((tab, index) => {
                const day = index === 0 ? 'all' : index
                const isActive = effectiveDayFilter === day
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
              <div>
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
                {selectedPlace.images && selectedPlace.images.length > 0 && (
                  <div className='overflow-x-auto pt-2 pb-20 whitespace-nowrap'>
                    <div className='px-5 pb-2 text-3xl font-bold text-[var(--Blue-Scale-blue-500)]'>
                      {selectedPlace.images.length}장
                    </div>
                    <div className='grid grid-cols-5 gap-1 pr-15 pl-5'>
                      {selectedPlace.images.map((image) => (
                        <img
                          key={image.id}
                          src={image.url}
                          alt={`place image ${image.id}`}
                          className='aspect-square h-full w-full cursor-pointer rounded-2xl object-cover'
                          onClick={() => openModal(image, selectedPlace.images)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </FixedActionBar>
      )}

      {isModalOpen &&
        selectedImage &&
        createPortal(
          <div
            className='fixed inset-0 z-100 flex flex-col bg-black/90 p-10'
            onClick={closeModal}
          >
            <div className='absolute top-5 left-1/2 -translate-x-1/2 text-center text-white'>
              <h2 className='text-lg font-bold'>{selectedImage.placeName}</h2>
              <p className='text-sm'>{formatDate(selectedImage.date)}</p>
            </div>
            <button
              onClick={closeModal}
              className='absolute top-5 right-5 z-[120] border-none text-white'
            >
              <X size={32} />
            </button>
            <div className='flex h-full w-full items-center justify-between'>
              <button
                className='border-none text-white'
                onClick={showPrevImage}
              >
                <ArrowLeft size={48} />
              </button>
              <div className='flex h-full flex-col items-center justify-center p-10'>
                <img
                  src={selectedImage.url}
                  alt='enlarged'
                  className='max-h-full max-w-full object-contain'
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <button
                className='border-none text-white'
                onClick={showNextImage}
              >
                <ArrowRight size={48} />
              </button>
            </div>
          </div>,
          document.getElementById('root'),
        )}
    </div>
  )
}

export default TripPlaceMap
