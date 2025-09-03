import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import readTripInfoApi from '@/apis/trip/readTripInfo'
import DayTabs from './DayTabs'
import PhotoAlbum from './PhotoAlbum'
import FixedActionBar from '@/components/common/FixedActionBar'
import ImageUploadIcon from '@/assets/dashboard/ImageUploadIcon'
import uploadImagesAPi from '@/apis/image/uploadImagesApi'
import readPlanningDatePlaceApi from '@/apis/planning-dashboard/readPlanningDatePlaceApi'

const GalleryDashBoard = ({ activeTab }) => {
  const { tripId } = useParams()
  const [tripInfo, setTripInfo] = useState(null)
  const fileInputRef = useRef(null)
  const [activeDay, setActiveDay] = useState(0)
  const [planningPlaces, setPlanningPlaces] = useState([])

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const result = await readTripInfoApi(tripId)
        setTripInfo(result.data)
      } catch (err) {
        alert('여행 정보를 불러오지 못했습니다.')
      }
    }

    /**일자 ID를 위해 전체 일정 불러오기 */
    const fetchPlanningPlaces = async () => {
      try {
        const result = await readPlanningDatePlaceApi(tripId)
        setPlanningPlaces(result.data)
      } catch (err) {
        alert(err.message)
      }
    }

    fetchTrip()
    fetchPlanningPlaces()
  }, [tripId])

  if (!tripInfo) return null

  /**버튼 클릭 시 input 실행 */
  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = async (event) => {
    const files = event.target.files
    if (files.length > 0) {
      const formData = new FormData()
      Array.from(files).forEach((file) => {
        formData.append('images', file)
      })

      console.log('Uploading files:', files)
      try {
        await uploadImagesAPi(tripId, planningPlaces[activeDay].id, formData)
        alert(`${files.length}개의 사진을 성공적으로 업로드했습니다.`)
      } catch (err) {
        alert(err.message)
      }
    }
  }

  return (
    <div className='pb-[150px]'>
      <DayTabs
        startedAt={tripInfo.startedAt}
        endedAt={tripInfo.endedAt}
        activeDay={activeDay}
        onDayChange={setActiveDay}
      />
      <PhotoAlbum />

      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept='image/*'
        multiple
      />

      {activeTab === 1 && (
        <FixedActionBar className='flex justify-center'>
          <div className='flex w-4xl items-center justify-center rounded-t-[20px] bg-white p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
            {activeDay === 0 ? (
              <button
                disabled
                className='flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border-none bg-gray-300 p-[20px] text-2xl text-white'
              >
                날짜를 선택해주세요
              </button>
            ) : (
              <button
                onClick={handleUploadClick}
                className='flex w-full items-center justify-center gap-2 rounded-lg border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
              >
                <ImageUploadIcon />
                사진 업로드하기
              </button>
            )}
          </div>
        </FixedActionBar>
      )}
    </div>
  )
}

export default GalleryDashBoard
