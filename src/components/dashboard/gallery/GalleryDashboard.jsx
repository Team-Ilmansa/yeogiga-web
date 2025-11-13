import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import JSZip from 'jszip'
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
import readGroupedImagesByPlace from '@/apis/image/readGroupedImagesByPlace'
import deleteTemporaryImagesApi from '@/apis/image/deleteTemporaryImagesApi'
import matchTemporaryImagesApi from '@/apis/image/matchTemporaryImagesApi'
import deleteSingleImageApi from '@/apis/image/deleteSingleImageApi'
import updateFavoriteImageApi from '@/apis/image/updateFavoriteImageApi'
import {
  Link2,
  Trash2,
  Heart,
  Share2,
  Download,
  RefreshCcw,
} from 'lucide-react'
import Spinner from '@/assets/common/Spinner'
import reassignImagesApi from '@/apis/image/reassignImagesApi'

const GalleryDashBoard = ({ activeTab, showFavorites = false }) => {
  const { tripId } = useParams()
  const [tripInfo, setTripInfo] = useState(null)
  const fileInputRef = useRef(null)
  const [activeDay, setActiveDay] = useState(0)
  const [planningPlaces, setPlanningPlaces] = useState([])
  const [temporaryImages, setTemporaryImages] = useState([])
  const [matchedImages, setMatchedImages] = useState([])
  const [unmatchedImages, setUnmatchedImages] = useState([])
  const [isTempSelectionMode, setIsTempSelectionMode] = useState(false)
  const [selectedTempImages, setSelectedTempImages] = useState({
    imageIds: [],
    urls: [],
  })
  const [isAlbumSelectionMode, setIsAlbumSelectionMode] = useState(false)
  const [selectedAlbumImages, setSelectedAlbumImages] = useState([])
  const [refreshKey, setRefreshKey] = useState(0) // Add refreshKey state

  const [isUploading, setIsUploading] = useState(false)
  const [uploadCount, setUploadCount] = useState(0)

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const result = await readTripInfoApi(tripId)
        setTripInfo(result.data)
      } catch (err) {
        alert(err.message)
      }
    }

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
  const fetchTemporaryImages = useCallback(async () => {
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
  }, [activeDay, planningPlaces, tripId])

  /**장소별 매칭된 이미지 불러오기 */
  const fetchMatchedImages = useCallback(async () => {
    if (activeDay > 0 && planningPlaces.length > 0) {
      try {
        const dayData = planningPlaces[activeDay - 1]
        const tripDayPlaceId = dayData.id
        if (dayData.places && dayData.places.length > 0) {
          const placesWithImages = await Promise.all(
            dayData.places.map(async (place) => {
              const result = await readMatchedImagesApi(
                tripId,
                tripDayPlaceId,
                place.id,
              )
              return {
                ...place,
                images: (result.data && result.data.images) || [],
              }
            }),
          )
          setMatchedImages(placesWithImages)
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
  }, [activeDay, planningPlaces, tripId])

  /**매칭되지 않은 이미지 불러오기 */
  const fetchUnmatchedImages = useCallback(async () => {
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
  }, [activeDay, planningPlaces, tripId])

  const fetchAllDaysImages = useCallback(async () => {
    if (!tripInfo || !planningPlaces.length) return

    const placeNameMap = new Map()
    planningPlaces.forEach((day) => {
      day.places.forEach((place) => {
        placeNameMap.set(place.id, place.name)
      })
    })

    try {
      const tripDuration =
        (new Date(tripInfo.endedAt) - new Date(tripInfo.startedAt)) /
          (1000 * 60 * 60 * 24) +
        1
      const dayPromises = Array.from({ length: tripDuration }, (_, i) =>
        readGroupedImagesByPlace(tripId, i + 1),
      )
      const results = await Promise.all(dayPromises)

      const allImages = []
      results.forEach((result, index) => {
        const tripDayPlaceId = planningPlaces[index]?.id
        if (result.data) {
          result.data.byPlace.forEach((place) => {
            const placeName =
              placeNameMap.get(place.placeId) || '알 수 없는 장소'
            allImages.push(
              ...place.images.map((image) => ({
                ...image,
                placeId: place.placeId,
                tripDayPlaceId,
                placeName: placeName,
              })),
            )
          })
          if (result.data.unmatched) {
            allImages.push(
              ...result.data.unmatched.map((image) => ({
                ...image,
                placeId: null,
                tripDayPlaceId,
                placeName: '기타',
              })),
            )
          }
        }
      })

      setMatchedImages([{ id: 'all-days', name: '전체', images: allImages }])
      setUnmatchedImages([])
    } catch (err) {
      console.error('Failed to fetch all images:', err)
      setMatchedImages([])
      setUnmatchedImages([])
    }
  }, [tripId, tripInfo, planningPlaces])

  const fetchAllFavoriteImages = useCallback(async () => {
    if (!tripInfo || !planningPlaces.length) return

    const placeNameMap = new Map()
    planningPlaces.forEach((day) => {
      day.places.forEach((place) => {
        placeNameMap.set(place.id, place.name)
      })
    })

    try {
      const tripDuration =
        (new Date(tripInfo.endedAt) - new Date(tripInfo.startedAt)) /
          (1000 * 60 * 60 * 24) +
        1
      const dayPromises = Array.from({ length: tripDuration }, (_, i) =>
        readGroupedImagesByPlace(tripId, i + 1),
      )
      const results = await Promise.all(dayPromises)

      let allImages = []
      results.forEach((result, index) => {
        const tripDayPlaceId = planningPlaces[index]?.id
        if (result.data) {
          result.data.byPlace.forEach((place) => {
            const placeName =
              placeNameMap.get(place.placeId) || '알 수 없는 장소'
            allImages.push(
              ...place.images.map((image) => ({
                ...image,
                placeId: place.placeId,
                tripDayPlaceId,
                placeName: placeName,
              })),
            )
          })
          if (result.data.unmatched) {
            allImages.push(
              ...result.data.unmatched.map((image) => ({
                ...image,
                placeId: null,
                tripDayPlaceId,
                placeName: '기타',
              })),
            )
          }
        }
      })

      const favoriteImages = allImages.filter((image) => image.favorite)

      setMatchedImages([
        { id: 'favorites', name: '즐겨찾는 사진', images: favoriteImages },
      ])
      setUnmatchedImages([])
      setTemporaryImages([]) // No temporary images in favorites view
    } catch (err) {
      console.error('Failed to fetch favorite images:', err)
      setMatchedImages([])
      setUnmatchedImages([])
    }
  }, [tripId, tripInfo, planningPlaces])

  const onImageAction = useCallback(() => {
    if (showFavorites) {
      fetchAllFavoriteImages()
    } else {
      if (activeDay === 0) {
        fetchAllDaysImages()
      } else {
        fetchMatchedImages()
        fetchUnmatchedImages()
      }
      fetchTemporaryImages()
    }
    setRefreshKey((prevKey) => prevKey + 1)
  }, [
    activeDay,
    showFavorites,
    fetchTemporaryImages,
    fetchMatchedImages,
    fetchUnmatchedImages,
    fetchAllDaysImages,
    fetchAllFavoriteImages,
  ])

  useEffect(() => {
    onImageAction()
  }, [onImageAction])

  /**임시저장 이미지 선택 모드 */
  const toggleTempSelectionMode = () => {
    setIsTempSelectionMode(!isTempSelectionMode)
    setSelectedTempImages({ imageIds: [], urls: [] })
  }

  const handleTempImageClick = (image) => {
    if (!isTempSelectionMode) {
      setIsTempSelectionMode(true)
    }
    setSelectedTempImages((prev) => {
      const isSelected = prev.imageIds.includes(image.id)
      if (isSelected) {
        return {
          imageIds: prev.imageIds.filter((id) => id !== image.id),
          urls: prev.urls.filter((url) => url !== image.url),
        }
      } else {
        return {
          imageIds: [...prev.imageIds, image.id],
          urls: [...prev.urls, image.url],
        }
      }
    })
  }

  const handleDeleteSelectedTempImages = async () => {
    try {
      await deleteTemporaryImagesApi(
        tripId,
        planningPlaces[activeDay - 1].id,
        selectedTempImages,
      )
      alert(`${selectedTempImages.imageIds.length}개의 이미지를 삭제했습니다.`)
      fetchTemporaryImages()
      toggleTempSelectionMode()
    } catch (err) {
      alert(err.message)
    }
  }

  /**매칭된 이미지 선택 모드 */
  const toggleAlbumSelectionMode = () => {
    setIsAlbumSelectionMode(!isAlbumSelectionMode)
    setSelectedAlbumImages([])
  }

  const handleAlbumImageClick = (image) => {
    if (!isAlbumSelectionMode) {
      setIsAlbumSelectionMode(true)
    }
    setSelectedAlbumImages((prev) => {
      const isSelected = prev.some((img) => img.id === image.id)
      if (isSelected) {
        return prev.filter((img) => img.id !== image.id)
      } else {
        return [
          ...prev,
          {
            id: image.id,
            url: image.url,
            placeId: image.placeId,
            tripDayPlaceId: image.tripDayPlaceId,
          },
        ]
      }
    })
  }

  const handleDeleteSelectedAlbumImages = async () => {
    if (selectedAlbumImages.length === 0) return

    if (
      !window.confirm(
        `${selectedAlbumImages.length}개의 이미지를 삭제하시겠습니까?`,
      )
    ) {
      return
    }

    try {
      const deletePromises = selectedAlbumImages.map(async (image) => {
        const tripDayPlaceId =
          activeDay > 0
            ? planningPlaces[activeDay - 1].id
            : image.tripDayPlaceId
        const body = image.placeId
          ? {
              url: image.url,
              placeId: image.placeId,
              deleteType: 'PLACE',
            }
          : { url: image.url, deleteType: 'UNMATCHED' }
        await deleteSingleImageApi(tripId, tripDayPlaceId, image.id, body)
      })
      await Promise.all(deletePromises)
      alert(`${selectedAlbumImages.length}개의 이미지를 삭제했습니다.`)
    } catch (err) {
      alert(err.message || '이미지 삭제에 실패했습니다.')
    } finally {
      setSelectedAlbumImages([])
      setIsAlbumSelectionMode(false)
      onImageAction()
    }
  }

  const handleFavoriteSelectedAlbumImages = async () => {
    if (selectedAlbumImages.length === 0) return

    const newFavoriteStatus = true

    if (
      !window.confirm(
        `${selectedAlbumImages.length}개의 이미지를 즐겨찾기에 추가하시겠습니까?`,
      )
    ) {
      return
    }

    try {
      const favoritePromises = selectedAlbumImages.map(async (image) => {
        const tripDayPlaceId =
          activeDay > 0
            ? planningPlaces[activeDay - 1].id
            : image.tripDayPlaceId
        const body = image.placeId
          ? { placeId: image.placeId, favorite: newFavoriteStatus }
          : { favorite: newFavoriteStatus }
        await updateFavoriteImageApi(tripId, tripDayPlaceId, image.id, body)
      })
      await Promise.all(favoritePromises)
      alert(
        `${selectedAlbumImages.length}개의 이미지를 즐겨찾기에 추가했습니다.`,
      )
    } catch (err) {
      alert(err.message || '즐겨찾기 처리에 실패했습니다.')
    } finally {
      setSelectedAlbumImages([])
      setIsAlbumSelectionMode(false)
      onImageAction()
    }
  }

  const handleShareSelectedAlbumImages = async () => {
    if (selectedAlbumImages.length === 0) return

    const urls = selectedAlbumImages.map((image) => image.url)
    const shareText = `[여기가] 여행 이미지 공유\n\n${urls.join('\n')}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: '여기가 여행 이미지 공유',
          text: shareText,
        })
        setSelectedAlbumImages([])
        setIsAlbumSelectionMode(false)
      } catch (err) {
        console.error('Share failed:', err)
      }
    } else {
      alert('사용 중인 브라우저에서는 공유 기능을 지원하지 않습니다.')
    }
  }

  const handleDownloadSelectedAlbumImages = async () => {
    if (selectedAlbumImages.length === 0) return
    if (
      !window.confirm(
        `${selectedAlbumImages.length}개의 이미지를 다운로드하시겠습니까?`,
      )
    ) {
      return
    }

    const zip = new JSZip()
    try {
      await Promise.all(
        selectedAlbumImages.map(async (image) => {
          const response = await fetch(image.url)
          const blob = await response.blob()
          const filename = image.url.substring(image.url.lastIndexOf('/') + 1)
          zip.file(filename, blob)
        }),
      )

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(zipBlob)
      link.download = `yeogiga_images_${tripId}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)

      setSelectedAlbumImages([])
      setIsAlbumSelectionMode(false)
    } catch (err) {
      console.error('Failed to download images:', err)
      alert('이미지 다운로드에 실패했습니다.')
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
      const numFiles = files.length
      setUploadCount(numFiles)
      setIsUploading(true)

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
      } finally {
        setIsUploading(false)
        setUploadCount(0)
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
        onImageAction()
      } catch (err) {
        alert(err.message || '이미지 매칭에 실패했습니다.')
      }
    }
  }

  /**이미지 재정렬 함수 */
  const handleReMatchImages = async () => {
    if (activeDay > 0 && planningPlaces.length > 0) {
      try {
        const tripDayPlaceId = planningPlaces[activeDay - 1].id
        await reassignImagesApi(tripId, tripDayPlaceId)
        alert('이미지 재정렬이 완료되었습니다.')
        fetchTemporaryImages()
        onImageAction()
      } catch (err) {
        alert(err.message || '이미지 재정렬을 실패했습니다.')
      }
    }
  }

  return (
    <div className='pb-[150px]'>
      {!showFavorites && (
        <DayTabs
          startedAt={tripInfo.startedAt}
          endedAt={tripInfo.endedAt}
          activeDay={activeDay}
          onDayChange={setActiveDay}
        />
      )}
      <PhotoAlbum
        key={refreshKey} // Add key prop
        tripId={tripId}
        tripDayPlaceId={
          activeDay > 0 && planningPlaces.length >= activeDay
            ? planningPlaces[activeDay - 1].id
            : undefined
        }
        temporaryImages={temporaryImages}
        matchedImages={matchedImages}
        unmatchedImages={unmatchedImages}
        isTempSelectionMode={isTempSelectionMode}
        selectedTempImages={selectedTempImages}
        toggleTempSelectionMode={toggleTempSelectionMode}
        handleTempImageClick={handleTempImageClick}
        isAlbumSelectionMode={isAlbumSelectionMode}
        selectedAlbumImages={selectedAlbumImages}
        toggleAlbumSelectionMode={toggleAlbumSelectionMode}
        handleAlbumImageClick={handleAlbumImageClick}
        onImageAction={onImageAction}
        showFavorites={showFavorites}
        planningPlaces={planningPlaces}
      />

      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept='image/*'
        multiple
      />

      {activeTab === 1 && !showFavorites && (
        <FixedActionBar className='flex justify-center'>
          <div className='flex w-4xl items-center justify-center rounded-t-[20px] bg-white p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
            {isUploading ? (
              <button
                disabled
                className='flex w-full cursor-not-allowed items-center justify-center gap-4 rounded-lg border-none bg-gray-400 p-[20px] text-2xl text-white'
              >
                <Spinner size={40} />
                {`사진 ${uploadCount}장 업로드 중`}
              </button>
            ) : selectedTempImages.imageIds.length > 0 ? (
              <button
                onClick={handleDeleteSelectedTempImages}
                className='flex w-full items-center justify-center gap-2 rounded-lg border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
              >
                <Trash2 className='h-[40px] w-[40px]' />
                {`${selectedTempImages.imageIds.length}개의 임시 저장 이미지 삭제`}
              </button>
            ) : selectedAlbumImages.length > 0 ? (
              <div className='flex w-full items-center justify-around'>
                <button
                  onClick={handleDeleteSelectedAlbumImages}
                  className='flex flex-col items-center gap-1 border-none text-[var(--Grey-Scale-grey-200)]'
                >
                  <Trash2 size={40} />
                  <span>삭제</span>
                </button>
                <button
                  onClick={handleFavoriteSelectedAlbumImages}
                  className='flex flex-col items-center gap-1 border-none text-[var(--Grey-Scale-grey-200)]'
                >
                  <Heart size={40} />
                  <span>즐겨찾기</span>
                </button>
                <button
                  onClick={handleShareSelectedAlbumImages}
                  className='flex flex-col items-center gap-1 border-none text-[var(--Grey-Scale-grey-200)]'
                >
                  <Share2 size={40} />
                  <span>공유</span>
                </button>
                <button
                  onClick={handleDownloadSelectedAlbumImages}
                  className='flex flex-col items-center gap-1 border-none text-[var(--Grey-Scale-grey-200)]'
                >
                  <Download size={40} />
                  <span>다운로드</span>
                </button>
              </div>
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
              <div className='flex w-full gap-4'>
                <button
                  onClick={handleUploadClick}
                  className='flex w-full items-center justify-center gap-2 rounded-lg border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
                >
                  <ImageUploadIcon />
                  사진 업로드하기
                </button>
                <button
                  onClick={handleReMatchImages}
                  className='flex w-full items-center justify-center gap-2 rounded-lg border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
                >
                  <RefreshCcw className='h-[40px] w-[40px]' />
                  이미지 재정렬하기
                </button>
              </div>
            )}
          </div>
        </FixedActionBar>
      )}
    </div>
  )
}

export default GalleryDashBoard
