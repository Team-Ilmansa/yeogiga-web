import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import readTripInfoApi from '@/apis/trip/readTripInfo'
import DayTabs from './DayTabs'
import PhotoAlbum from './PhotoAlbum'
import FixedActionBar from '@/components/common/FixedActionBar'
import ImageUploadIcon from '@/assets/dashboard/ImageUploadIcon'
import uploadImagesApi from '@/apis/image/uploadImagesApi'
import readPlanningDatePlaceApi from '@/apis/planning-dashboard/readPlanningDatePlaceApi'
import readTemporaryImagesApi from '@/apis/image/readTemporaryImagesApi'
import readMatchedImagesApi from '@/apis/image/readMatchedImagesApi'
import readUnmatchedImagesApi from '@/apis/image/readUnmatchedImagesApi'
import deleteTemporaryImagesApi from '@/apis/image/deleteTemporaryImagesApi'
import matchTemporaryImagesApi from '@/apis/image/matchTemporaryImagesApi'
import { Link2, Trash2 } from 'lucide-react'

const GalleryDashBoard = ({ activeTab }) => {
  const { tripId } = useParams()
  const [tripInfo, setTripInfo] = useState(null)
  const fileInputRef = useRef(null)
  const [activeDay, setActiveDay] = useState(0)
  const [planningPlaces, setPlanningPlaces] = useState([])
  const [temporaryImages, setTemporaryImages] = useState([])
  const [matchedImages, setMatchedImages] = useState([])
  const [unmatchedImages, setUnmatchedImages] = useState([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedImages, setSelectedImages] = useState({
    imageIds: [],
    urls: [],
  })

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

  /**임시 저장 이미지 불러오기 */
  const fetchTemporaryImages = async () => {
    if (activeDay > 0 && planningPlaces.length > 0) {
      try {
        const tripDayPlaceId = planningPlaces[activeDay - 1].id
        const result = await readTemporaryImagesApi(tripId, tripDayPlaceId)
        setTemporaryImages(result.data || [])
      } catch (err) {
        console.error('Failed to fetch temporary images:', err)
        setTemporaryImages([])
      }
    } else {
      setTemporaryImages([])
    }
  }

  /**장소별 매칭된 이미지 불러오기 */
  const fetchMatchedImages = async () => {
    if (activeDay > 0 && planningPlaces.length > 0) {
      try {
        const dayData = planningPlaces[activeDay - 1]
        const tripDayPlaceId = dayData.id
        if (dayData.places && dayData.places.length > 0) {
          const imagePromises = dayData.places.map((place) =>
            readMatchedImagesApi(tripId, tripDayPlaceId, place.id),
          )
          const results = await Promise.all(imagePromises)
          const allImages = results.flatMap((result) => result.data || [])
          setMatchedImages(allImages)
        } else {
          setMatchedImages([])
        }
      } catch (err) {
        console.error('Failed to fetch matched images:', err)
        setMatchedImages([])
      }
    } else {
      setMatchedImages([])
    }
  }

  /**매칭되지 않은 이미지 불러오기 */
  const fetchUnmatchedImages = async () => {
    if (activeDay > 0 && planningPlaces.length > 0) {
      try {
        const tripDayPlaceId = planningPlaces[activeDay - 1].id
        const result = await readUnmatchedImagesApi(tripId, tripDayPlaceId)
        setUnmatchedImages(result.data.images || [])
      } catch (err) {
        console.error('Failed to fetch unmatched images:', err)
        setUnmatchedImages([])
      }
    } else {
      setUnmatchedImages([])
    }
  }

  useEffect(() => {
    fetchTemporaryImages()
    fetchMatchedImages()
    fetchUnmatchedImages()
  }, [activeDay, planningPlaces, tripId])

  /**선택 모드 전환 */
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode)
    setSelectedImages({ imageIds: [], urls: [] })
  }

  /**이미지 선택 */
  const handleImageClick = (image) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true)
      setSelectedImages({ imageIds: [image.id], urls: [image.url] })
      return
    }

    setSelectedImages((prevSelected) => {
      const isAlreadySelected = prevSelected.imageIds.includes(image.id)
      if (isAlreadySelected) {
        return {
          imageIds: prevSelected.imageIds.filter((id) => id !== image.id),
          urls: prevSelected.urls.filter((url) => url !== image.url),
        }
      } else {
        return {
          imageIds: [...prevSelected.imageIds, image.id],
          urls: [...prevSelected.urls, image.url],
        }
      }
    })
  }

  /**선택된 임시 이미지 삭제 */
  const handleDeleteSelectedTemporaryImages = async () => {
    try {
      await deleteTemporaryImagesApi(
        tripId,
        planningPlaces[activeDay - 1].id,
        selectedImages,
      )
      alert(`${selectedImages.imageIds.length}개의 이미지를 삭제했습니다.`)
      fetchTemporaryImages()
      toggleSelectionMode()
    } catch (err) {
      alert(err.message)
    }
  }

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

      try {
        const tripDayPlaceId = planningPlaces[activeDay - 1].id
        await uploadImagesApi(tripId, tripDayPlaceId, formData)
        alert(`${files.length}개의 사진을 성공적으로 업로드했습니다.`)
        fetchTemporaryImages()
      } catch (err) {
        alert(err.message)
      }
    }
  }

  /**이미지 매칭 함수 */
  const handleMatchImages = async () => {
    if (activeDay > 0 && planningPlaces.length > 0) {
      try {
        const tripDayPlaceId = planningPlaces[activeDay - 1].id
        await matchTemporaryImagesApi(tripId, tripDayPlaceId)
        alert('이미지 매칭이 완료되었습니다.')
        fetchTemporaryImages()
      } catch (err) {
        alert(err.message || '이미지 매칭에 실패했습니다.')
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
      <PhotoAlbum
        temporaryImages={temporaryImages}
        matchedImages={matchedImages}
        unmatchedImages={unmatchedImages}
        isSelectionMode={isSelectionMode}
        selectedImages={selectedImages}
        toggleSelectionMode={toggleSelectionMode}
        handleImageClick={handleImageClick}
      />

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
            {selectedImages.imageIds.length > 0 ? (
              <button
                onClick={handleDeleteSelectedTemporaryImages}
                className='flex w-full items-center justify-center gap-2 rounded-lg border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
              >
                <Trash2 className='h-[40px] w-[40px]' />
                {`${selectedImages.imageIds.length}개의 임시 저장 이미지 삭제`}
              </button>
            ) : activeDay === 0 ? (
              <button
                disabled
                className='flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border-none bg-gray-300 p-[20px] text-2xl text-white'
              >
                날짜를 선택해주세요
              </button>
            ) : temporaryImages.length > 0 ? (
              <div className='flex w-full gap-4'>
                <button
                  onClick={handleUploadClick}
                  className='flex w-full items-center justify-center gap-2 rounded-lg border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
                >
                  <ImageUploadIcon />
                  사진 업로드하기
                </button>
                <button
                  onClick={handleMatchImages}
                  className='flex w-full items-center justify-center gap-2 rounded-lg border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
                >
                  <Link2 className='h-[40px] w-[40px]' />
                  이미지 매칭하기
                </button>
              </div>
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
