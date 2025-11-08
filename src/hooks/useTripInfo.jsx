import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import readTripInfoApi from '@/apis/trip/readTripInfo'

/**여행 정보를 불러오기 위한 커스텀 훅 */
export const useTripInfo = () => {
  const { tripId } = useParams()
  const [tripInfo, setTripInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!tripId) {
      setLoading(false)
      return
    }

    const fetchTripInfo = async () => {
      setLoading(true)
      try {
        const result = await readTripInfoApi(tripId)
        setTripInfo(result.data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTripInfo()
  }, [tripId])

  return { tripInfo, loading, error }
}
