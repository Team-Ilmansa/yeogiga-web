import GoBack from '@/assets/sign-up/GoBack'
import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import readPlanningDatePlaceApi from '@/apis/planning-dashboard/readPlanningDatePlaceApi'
import readPlaceInfoApi from '@/apis/map/readPlaceInfoApi'
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import FixedActionBar from '@/components/common/FixedActionBar'

/** 저장된 목적지들을 보여주는 지도 화면 */
const TripPlaceMap = () => {
  const navigate = useNavigate()
  const { tripId } = useParams()

  const [map, setMap] = useState(null)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [places, setPlaces] = useState([])
  const [markers, setMarkers] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dayFilter, setDayFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  // 여행 정보 및 장소들 가져오기
  useEffect(() => {
    if (!tripId) return

    const fetchTripPlaces = async () => {
      setIsLoading(true)
      try {
        const placeSummariesResponse = await readPlanningDatePlaceApi(tripId)

        const allPlacesPromises = placeSummariesResponse.data.map(
          async (summary) => {
            const placeDetails = await readPlaceInfoApi(tripId, summary.id)
            return placeDetails.data.map((p) => ({ ...p, day: summary.day }))
          },
        )

        const allPlacesArrays = await Promise.all(allPlacesPromises)
        const allPlaces = allPlacesArrays.flat()

        setPlaces(allPlaces)
      } catch (error) {
        console.error('Failed to fetch trip places:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTripPlaces()
  }, [tripId])

  // 지도 초기화
  useEffect(() => {
    const initMap = (lat, lng) => {
      const mapOptions = {
        center: new naver.maps.LatLng(lat, lng),
        zoom: 16,
        minZoom: 7,
        zoomControl: true,
        zoomControlOptions: {
          position: naver.maps.Position.TOP_RIGHT,
        },
      }
      const mapInstance = new naver.maps.Map('map', mapOptions)
      setMap(mapInstance)
    }

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
  }, [places, isLoading])

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

    markers.forEach((marker) => marker.setMap(null))

    if (filteredPlaces.length === 0) {
      setMarkers([])
      return
    }

    const newMarkers = filteredPlaces.map((place) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(place.latitude, place.longitude),
        map: map,
      })

      naver.maps.Event.addListener(marker, 'click', () => {
        setSelectedPlace(place)
        const placeIndex = filteredPlaces.findIndex((p) => p.id === place.id)
        if (placeIndex !== -1) {
          setCurrentIndex(placeIndex)
        }
      })

      return marker
    })

    setMarkers(newMarkers)
  }, [map, filteredPlaces])

  // 지도 뷰 조정
  useEffect(() => {
    if (map && selectedPlace) {
      map.panTo(
        new naver.maps.LatLng(selectedPlace.latitude, selectedPlace.longitude),
      )
      map.setZoom(16, true)
    }
  }, [map, selectedPlace])

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

  return (
    <div className='relative h-full w-full'>
      <div className='absolute top-4 left-4 z-10 flex items-center'>
        <button
          className='text-bold my-5 border-none px-8'
          onClick={() => navigate(-1)}
        >
          <GoBack />
        </button>
      </div>

      <div
        id='map'
        className={`h-full w-full ${isLoading ? 'invisible' : ''}`}
      ></div>
      {isLoading && (
        <div className='bg-opacity-50 absolute inset-0 flex items-center justify-center bg-white'>
          <p>Loading map...</p>
        </div>
      )}

      {!isLoading && places.length > 0 && (
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
                  <div className='flex h-15 w-15 cursor-grab items-center justify-center rounded-full bg-[var(--Grey-Scale-grey-100)]'>
                    C
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
