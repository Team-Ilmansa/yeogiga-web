import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import readTripInfoApi from '@/apis/trip/readTripInfo'
import DayTabs from './DayTabs'
import PhotoAlbum from './PhotoAlbum'
import FixedActionBar from '@/components/common/FixedActionBar'
import ImageUploadIcon from '@/assets/dashboard/ImageUploadIcon'

const GalaryDashBoard = ({ activeTab }) => {
  const { tripId } = useParams()
  const [tripInfo, setTripInfo] = useState(null)

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const result = await readTripInfoApi(tripId)
        setTripInfo(result.data)
      } catch (err) {
        alert('여행 정보를 불러오지 못했습니다.')
      }
    }

    fetchTrip()
  }, [tripId])

  if (!tripInfo) return null

  return (
    <div className='pb-[150px]'>
      <DayTabs startedAt={tripInfo.startedAt} endedAt={tripInfo.endedAt} />
      <PhotoAlbum />

      {activeTab === 1 && (
        <FixedActionBar className='flex justify-center'>
          <div className='flex w-4xl items-center justify-center rounded-t-[20px] bg-white p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
            <button className='flex w-full items-center justify-center gap-2 rounded-lg border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'>
              <ImageUploadIcon />
              사진 업로드하기
            </button>
          </div>
        </FixedActionBar>
      )}
    </div>
  )
}

export default GalaryDashBoard
