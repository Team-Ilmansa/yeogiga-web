import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import readPinApi from '@/apis/pin/readPinApi'
import PlaceMap from '@/pages/PlaceMap'

const PlaceMapWithPin = () => {
  const { tripId } = useParams()
  const [coords, setCoords] = useState({ lat: null, lng: null })

  /** 집결지 여부 상태 */
  const [hasPin, setHasPin] = useState(true)

  useEffect(() => {
    const fetchPin = async () => {
      try {
        const result = await readPinApi(tripId)
        console.log('[PlaceMapWithPin] API 결과:', result)

        const pinData = result?.data
        if (pinData?.latitude && pinData?.longitude) {
          setCoords({
            lat: pinData.latitude,
            lng: pinData.longitude,
          })
          setHasPin(true)
        } else {
          console.warn('[PlaceMapWithPin] 집결지가 없습니다.')
          setHasPin(false)
        }
      } catch (err) {
        console.error(err)
        setHasPin(false)
      }
    }

    fetchPin()
  }, [tripId])

  if (!hasPin) {
    return <p>집결지가 없습니다.</p>
  }

  if (!coords.lat || !coords.lng) {
    return <p>지도를 불러오는 중...</p>
  }

  return <PlaceMap lat={coords.lat} lng={coords.lng} />
}

export default PlaceMapWithPin
