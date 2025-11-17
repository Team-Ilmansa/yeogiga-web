import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import readPinApi from '@/apis/pin/readPinApi'
import RallyPointPin from '@/assets/map/RallyPointPin'
import ReactDOMServer from 'react-dom/server'
import GoBack from '@/assets/sign-up/GoBack'

const RallyPointViewer = () => {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const [map, setMap] = useState(null)
  const [rallyPin, setRallyPin] = useState(null)

  useEffect(() => {
    const fetchRallyPin = async () => {
      try {
        const result = await readPinApi(tripId)
        if (result && result.data) {
          setRallyPin(result.data)
        } else {
          alert('설정된 집결지 정보가 없습니다.')
          navigate(-1)
        }
      } catch (error) {
        console.warn('집결지를 불러오는 데 실패했습니다:', error.message)
        alert('집결지 정보를 불러오는 데 실패했습니다.')
        navigate(-1)
      }
    }

    fetchRallyPin()
  }, [tripId, navigate])

  useEffect(() => {
    if (rallyPin) {
      const initMap = (lat, lng) => {
        const mapOptions = {
          center: new window.naver.maps.LatLng(lat, lng),
          zoom: 18,
          minZoom: 7,
          zoomControl: true,
          zoomControlOptions: {
            position: window.naver.maps.Position.TOP_RIGHT,
          },
        }
        const naverMap = new window.naver.maps.Map('map', mapOptions)
        setMap(naverMap)
      }
      initMap(rallyPin.latitude, rallyPin.longitude)
    }
  }, [rallyPin])

  useEffect(() => {
    if (map && rallyPin) {
      const pinHTML = ReactDOMServer.renderToString(<RallyPointPin />)

      new window.naver.maps.Marker({
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
    }
  }, [map, rallyPin])

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
      <div id='map' className='h-full w-full'></div>

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 z-10 flex w-full justify-center transition-all duration-300 ${
          rallyPin ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className='relative w-4xl'>
          <div className='flex flex-col gap-3 rounded-t-2xl border-t border-gray-300 bg-white p-10'>
            {rallyPin && (
              <div className='flex flex-col gap-1'>
                <h3 className='text-3xl font-bold text-[var(--Grey-Scale-grey-400)]'>
                  {rallyPin.place}
                </h3>
                <p className='text-base text-gray-600'>
                  {new Date(rallyPin.time).toLocaleString('ko-KR')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RallyPointViewer
