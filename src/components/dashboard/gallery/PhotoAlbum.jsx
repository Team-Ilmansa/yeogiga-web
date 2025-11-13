import { useState } from 'react'
import { createPortal } from 'react-dom'
import NoUploadImage from '@/assets/dashboard/NoUploadImage'
import updateFavoriteImageApi from '@/apis/image/updateFavoriteImageApi'
import {
  moveMatchedToMatched,
  moveUnmatchedToMatched,
  moveMatchedToUnmatched, // 추가
} from '@/apis/image/moveImageApi'
import { Check, ArrowLeft, ArrowRight, Heart } from 'lucide-react'
import deleteSingleImageApi from '@/apis/image/deleteSingleImageApi'
import KebabIcon from '@/assets/dashboard/KebabIcon'
import PhotoKebabModal from '../modal/PhotoKebabModal'
import TouristIcon from '@/assets/map/category/TouristIcon'
import LodgingIcon from '@/assets/map/category/LodgingIcon'
import MealIcon from '@/assets/map/category/MealIcon'
import TransportIcon from '@/assets/map/category/TransportIcon'
import EtcIcon from '@/assets/map/category/EtcIcon'

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
  const ampm = hours >= 12 ? '오후' : '오전' // AM/PM in Korean
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  hours = String(hours).padStart(2, '0') // Pad with leading zero for single-digit hours

  return `${year}.${month}.${day} ${ampm} ${hours}:${minutes}`
}

const PhotoAlbum = ({
  tripId,
  tripDayPlaceId,
  temporaryImages,
  unmatchedImages,
  matchedImages,
  isTempSelectionMode,
  selectedTempImages,
  toggleTempSelectionMode,
  handleTempImageClick,
  isAlbumSelectionMode,
  selectedAlbumImages,
  toggleAlbumSelectionMode,
  handleAlbumImageClick,
  onImageAction,
  planningPlaces,
}) => {
  const [modalImage, setModalImage] = useState(null)
  const [showKebabMenu, setShowKebabMenu] = useState(false)
  const [showMoveLocationModal, setShowMoveLocationModal] = useState(false)
  const [selectedDayForMove, setSelectedDayForMove] = useState(1)
  const [selectedPlaceForMove, setSelectedPlaceForMove] = useState(null)
  const hasTemporaryImages = temporaryImages && temporaryImages.length > 0
  const hasMatchedImages = matchedImages && matchedImages.length > 0
  const hasUnmatchedImages = unmatchedImages && unmatchedImages.length > 0
  const totalImages =
    hasMatchedImages || hasUnmatchedImages
      ? matchedImages.reduce((acc, place) => acc + place.images.length, 0) +
        unmatchedImages.length
      : 0

  const allImagesForModal = matchedImages
    .flatMap((place) =>
      (place.images || []).map((image) => {
        const isSpecialView =
          place.id === 'all-days' || place.id === 'favorites'
        return {
          ...image,
          placeId: isSpecialView ? image.placeId : place.id,
          placeName: image.placeName || place.name,
        }
      }),
    )
    .concat(unmatchedImages.map((image) => ({ ...image, placeName: '기타' })))

  const openModal = (image) => {
    if (isAlbumSelectionMode) {
      handleAlbumImageClick(image)
      return
    }
    const imageWithPlace = allImagesForModal.find((img) => img.id === image.id)
    setModalImage(imageWithPlace)
  }

  const closeModal = () => {
    setModalImage(null)
    setShowKebabMenu(false)
    onImageAction() // Always refresh the main album view when modal closes
  }

  const showNextImage = (e) => {
    if (e) e.stopPropagation()
    const currentIndex = allImagesForModal.findIndex(
      (img) => img.id === modalImage.id,
    )
    const nextIndex = (currentIndex + 1) % allImagesForModal.length
    setModalImage(allImagesForModal[nextIndex])
  }

  const showPrevImage = (e) => {
    if (e) e.stopPropagation()
    const currentIndex = allImagesForModal.findIndex(
      (img) => img.id === modalImage.id,
    )
    const prevIndex =
      (currentIndex - 1 + allImagesForModal.length) % allImagesForModal.length
    setModalImage(allImagesForModal[prevIndex])
  }

  const handleDownload = async (e) => {
    e.stopPropagation()
    if (!modalImage) return

    try {
      const response = await fetch(modalImage.url)
      if (!response.ok) throw new Error('네트워크가 응답하지 않습니다.')
      const blob = await response.blob()

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      const filename = modalImage.url.substring(
        modalImage.url.lastIndexOf('/') + 1,
      )
      link.download = filename || 'download'

      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('다운로드 실패: ', err)
      alert('이미지 다운로드에 실패했습니다.')
    }
    setShowKebabMenu(false)
  }

  const handleFavoriteClick = async (e) => {
    e.stopPropagation()
    if (!modalImage) return

    const newIsFavorite = !modalImage.favorite
    const body = modalImage.placeId
      ? { placeId: modalImage.placeId, favorite: newIsFavorite }
      : { favorite: newIsFavorite }

    try {
      const tripDayPlaceIdForApi = modalImage.tripDayPlaceId || tripDayPlaceId
      await updateFavoriteImageApi(
        tripId,
        tripDayPlaceIdForApi,
        modalImage.id,
        body,
      )

      setModalImage({ ...modalImage, favorite: newIsFavorite })
      onImageAction()
    } catch (err) {
      alert(err.message || '즐겨찾기 처리에 실패했습니다.')
    }
    setShowKebabMenu(false)
  }

  const handleSingleDelete = async (e) => {
    e.stopPropagation()
    if (!modalImage) return

    const body = modalImage.placeId
      ? {
          url: modalImage.url,
          placeId: modalImage.placeId,
          deleteType: 'PLACE',
        }
      : { url: modalImage.url, deleteType: 'UNMATCHED' }

    try {
      const tripDayPlaceIdForApi =
        modalImage.tripDayPlaceId || modalImage.tripDayPlaceId
      await deleteSingleImageApi(
        tripId,
        tripDayPlaceIdForApi,
        modalImage.id,
        body,
      )
      alert('삭제되었습니다')
      setShowKebabMenu(false)
      showNextImage()
      onImageAction()
    } catch (err) {
      alert(err.message || '사진 삭제에 실패했습니다.')
    }
  }

  const handleShare = async (e) => {
    e.stopPropagation()
    if (!modalImage) return

    const shareText = `[여기가] 여행 이미지 공유\n\n${modalImage.url}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: '여기가 여행 이미지 공유',
          text: shareText,
        })
      } catch (err) {
        console.error('Share failed:', err)
      }
    } else {
      alert('사용 중인 브라우저에서는 공유 기능을 지원하지 않습니다.')
    }
    setShowKebabMenu(false)
  }

  const handleMoveLocation = (e) => {
    e.stopPropagation()
    setShowKebabMenu(false)
    setShowMoveLocationModal(true)
  }

  const handleConfirmMove = async () => {
    if (!selectedPlaceForMove) return

    try {
      // Matched to Unmatched (기타로 이동)
      if (modalImage.placeId && selectedPlaceForMove.id === 'unmatched-etc') {
        let fromTripDayPlaceId = null
        for (const day of planningPlaces) {
          const foundPlace = day.places.find((p) => p.id === modalImage.placeId)
          if (foundPlace) {
            fromTripDayPlaceId = day.id
            break
          }
        }

        if (!fromTripDayPlaceId) {
          alert('사진의 원래 위치 정보를 찾을 수 없습니다.')
          return
        }

        const data = {
          placeId: modalImage.placeId,
          imageId: modalImage.id,
        }
        await moveMatchedToUnmatched(tripId, fromTripDayPlaceId, data)
        alert('사진 위치가 변경되었습니다.')
      }
      // Unmatched to Unmatched (기타에서 기타로 이동)
      else if (
        !modalImage.placeId &&
        selectedPlaceForMove.id === 'unmatched-etc'
      ) {
        alert('이미 기타에 있는 사진입니다.')
      }
      // 기존 로직 (Matched to Matched 또는 Unmatched to Matched)
      else if (modalImage.placeId) {
        // Matched to Matched
        let fromTripDayPlaceId = null
        let toTripDayPlaceId = null

        for (const day of planningPlaces) {
          if (!fromTripDayPlaceId) {
            const foundPlace = day.places.find(
              (p) => p.id === modalImage.placeId,
            )
            if (foundPlace) {
              fromTripDayPlaceId = day.id
            }
          }
          if (!toTripDayPlaceId) {
            const foundPlace = day.places.find(
              (p) => p.id === selectedPlaceForMove.id,
            )
            if (foundPlace) {
              toTripDayPlaceId = day.id
            }
          }
          if (fromTripDayPlaceId && toTripDayPlaceId) {
            break
          }
        }

        if (!fromTripDayPlaceId) {
          alert('사진의 원래 위치 정보를 찾을 수 없습니다.')
          return
        }
        if (!toTripDayPlaceId) {
          alert('사진을 옮길 위치 정보를 찾을 수 없습니다.')
          return
        }

        const data = {
          fromTripDayPlaceId: fromTripDayPlaceId,
          fromPlaceId: modalImage.placeId,
          toTripDayPlaceId: toTripDayPlaceId,
          toPlaceId: selectedPlaceForMove.id,
          imageId: modalImage.id,
        }
        await moveMatchedToMatched(tripId, data)
        alert('사진 위치가 변경되었습니다.')
      } else {
        // Unmatched to Matched
        let toTripDayPlaceId = null
        for (const day of planningPlaces) {
          const foundPlace = day.places.find(
            (p) => p.id === selectedPlaceForMove.id,
          )
          if (foundPlace) {
            toTripDayPlaceId = day.id
            break
          }
        }

        if (!toTripDayPlaceId) {
          alert('사진을 옮길 위치 정보를 찾을 수 없습니다.')
          return
        }

        const data = {
          placeId: selectedPlaceForMove.id,
          imageId: modalImage.id,
        }
        await moveUnmatchedToMatched(tripId, toTripDayPlaceId, data)
        alert('사진 위치가 변경되었습니다.')
      }

      setShowMoveLocationModal(false)
      setSelectedPlaceForMove(null)
      onImageAction()
      closeModal()
    } catch (err) {
      alert(err.message || '사진 위치 변경에 실패했습니다.')
    }
  }

  return (
    <div className='relative pb-[100px]'>
      {hasTemporaryImages && (
        <div className='mt-2'>
          <div className='flex justify-between'>
            <p className='py-2 text-[var(--Blue-Scale-blue-500)]'>
              임시 저장 이미지 ({temporaryImages.length}장)
            </p>
            <button
              onClick={toggleTempSelectionMode}
              className={`flex items-center gap-1 border-none py-2 ${
                isTempSelectionMode || selectedTempImages.imageIds.length > 0
                  ? 'text-[var(--Blue-Scale-blue-500)]'
                  : 'text-[var(--Grey-Scale-grey-200)]'
              }`}
            >
              {selectedTempImages.imageIds.length > 0
                ? `${selectedTempImages.imageIds.length}개 선택됨`
                : '선택하기'}
              <Check className='h-4 w-4' />
            </button>
          </div>
          <div className='grid grid-cols-5 gap-1'>
            {temporaryImages.map((image) => (
              <div
                key={image.id}
                className='relative aspect-square cursor-pointer'
                onClick={() => handleTempImageClick(image)}
              >
                <img
                  src={image.url}
                  alt={`temporary image ${image.id}`}
                  className={'h-full w-full rounded-2xl object-cover'}
                />
                {selectedTempImages.imageIds.includes(image.id) && (
                  <div className='absolute inset-0 flex items-center justify-center rounded-2xl bg-[var(--Blue-Scale-blue-500)] opacity-50' />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {totalImages > 0 && (
        <div className={hasTemporaryImages ? 'mt-8' : 'mt-2'}>
          <div className='flex justify-between'>
            <p className='py-2 text-3xl font-bold text-[var(--Blue-Scale-blue-500)]'>
              {totalImages}장
            </p>
            <button
              onClick={toggleAlbumSelectionMode}
              className={`flex items-center gap-1 border-none py-2 ${
                isAlbumSelectionMode || selectedAlbumImages.length > 0
                  ? 'text-[var(--Blue-Scale-blue-500)]'
                  : 'text-[var(--Grey-Scale-grey-200)]'
              }`}
            >
              {selectedAlbumImages.length > 0
                ? `${selectedAlbumImages.length}개 선택됨`
                : '선택하기'}
              <Check className='h-4 w-4' />
            </button>
          </div>

          {matchedImages.map((place) => (
            <div key={place.id}>
              {place.images.length > 0 && (
                <div className='py-2 text-[var(--Grey-Scale-grey-300)]'>
                  {place.name} ({place.images.length}장)
                </div>
              )}
              <div className='grid grid-cols-5 gap-1'>
                {place.images.map((image) => (
                  <div
                    key={image.id}
                    className='relative aspect-square cursor-pointer'
                    onClick={() => openModal(image)}
                  >
                    <img
                      src={image.url}
                      alt={`matched image ${image.id}`}
                      className='h-full w-full rounded-2xl object-cover'
                    />
                    {image.favorite && (
                      <div className='absolute top-2 right-2'>
                        <Heart
                          size={24}
                          fill='var(--Blue-Scale-blue-500)'
                          color='var(--Blue-Scale-blue-500)'
                        />
                      </div>
                    )}
                    {selectedAlbumImages.some((img) => img.id === image.id) && (
                      <div className='absolute inset-0 flex items-center justify-center rounded-2xl bg-[var(--Blue-Scale-blue-500)] opacity-50' />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div>
            {unmatchedImages.length > 0 && (
              <div className='py-2 text-[var(--Grey-Scale-grey-300)]'>
                기타 ({unmatchedImages.length}장)
              </div>
            )}
            <div className='grid grid-cols-5 gap-1'>
              {unmatchedImages.map((image) => (
                <div
                  key={image.id}
                  className='relative aspect-square cursor-pointer'
                  onClick={() => openModal(image, null)}
                >
                  <img
                    src={image.url}
                    alt={`matched image ${image.id}`}
                    className='h-full w-full rounded-2xl object-cover'
                  />
                  {image.favorite && (
                    <div className='absolute top-2 right-2'>
                      <Heart
                        size={24}
                        fill='var(--Blue-Scale-blue-500)'
                        color='var(--Blue-Scale-blue-500)'
                      />
                    </div>
                  )}
                  {selectedAlbumImages.some((img) => img.id === image.id) && (
                    <div className='absolute inset-0 flex items-center justify-center rounded-2xl bg-[var(--Blue-Scale-blue-500)] opacity-50' />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!hasTemporaryImages && totalImages === 0 && (
        <div className='mt-20 flex min-h-[200px] flex-col items-center justify-center gap-5 p-4'>
          <NoUploadImage size={100} />
          <p className='text-center text-2xl text-[var(--Grey-Scale-grey-200)]'>
            업로드된 이미지가 없어요
          </p>
        </div>
      )}

      {modalImage &&
        createPortal(
          <div
            className='fixed inset-0 z-100 flex flex-col bg-black/90 p-10'
            onClick={closeModal}
          >
            <div className='absolute top-5 left-1/2 -translate-x-1/2 text-center text-white'>
              <h2 className='text-lg font-bold'>{modalImage.placeName}</h2>
              <p className='text-sm'>{formatDate(modalImage.date)}</p>
            </div>
            <div className='absolute top-5 right-5 z-[120] flex gap-2'>
              <button
                className='border-none text-white'
                onClick={handleFavoriteClick}
              >
                <Heart
                  className='h-6 w-6'
                  fill={
                    modalImage.favorite ? 'var(--Blue-Scale-blue-500)' : 'none'
                  }
                  color={
                    modalImage.favorite ? 'var(--Blue-Scale-blue-500)' : 'white'
                  }
                />
              </button>
              <button
                className='border-none text-white'
                onClick={(e) => {
                  e.stopPropagation()
                  setShowKebabMenu(!showKebabMenu)
                }}
              >
                <KebabIcon color='white' />
              </button>
            </div>
            <div className='flex h-full w-full items-center justify-between'>
              <button
                className='border-none text-white'
                onClick={showPrevImage}
              >
                <ArrowLeft size={48} />
              </button>
              <div className='flex h-full flex-col items-center justify-center p-10'>
                <img
                  src={modalImage.url}
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
            {showKebabMenu && (
              <PhotoKebabModal
                onClose={() => setShowKebabMenu(false)}
                onDelete={handleSingleDelete}
                onDownload={handleDownload}
                onShare={handleShare}
                onMoveLocation={handleMoveLocation}
              />
            )}
            {showMoveLocationModal && (
              <div
                className='absolute inset-0 z-[130] flex items-center justify-center'
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMoveLocationModal(false)
                }}
              >
                <div
                  className='flex h-5/6 max-h-[90vh] w-11/12 max-w-2xl flex-col overflow-y-auto rounded-lg bg-white p-8'
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className='mb-4 text-center text-lg font-bold'>
                    사진 위치 옮기기
                  </h2>
                  <div className='mb-4 flex flex-wrap gap-[6px]'>
                    {planningPlaces.map((day, index) => (
                      <button
                        key={day.id}
                        onClick={() => setSelectedDayForMove(index + 1)}
                        className={`cursor-pointer rounded-full px-4 py-1 text-base ${
                          selectedDayForMove === index + 1
                            ? 'bg-[var(--Blue-Scale-blue-500)] text-white'
                            : 'border border-gray-300 bg-white text-gray-500'
                        }`}
                      >
                        DAY {index + 1}
                      </button>
                    ))}
                  </div>
                  <div className='flex flex-grow flex-col gap-2'>
                    {(() => {
                      const currentDayPlaces =
                        planningPlaces[selectedDayForMove - 1]?.places || []
                      const placesWithEtc = [
                        ...currentDayPlaces,
                        {
                          id: 'unmatched-etc',
                          name: '기타',
                          placeType: '기타',
                        },
                      ]
                      return placesWithEtc.map((place) => {
                        const Icon = categoryIcons[place.placeType] || EtcIcon
                        const color =
                          categoryColors[place.placeType] || '#C161EE'
                        return (
                          <button
                            key={place.id}
                            onClick={() => setSelectedPlaceForMove(place)}
                            className='flex items-center justify-start gap-5 border-none'
                          >
                            <div className='flex h-10 w-10 items-center justify-center rounded-full'>
                              <Icon size={40} color={color} />
                            </div>
                            <div
                              className={`flex w-full justify-between rounded-2xl p-5 text-base ${
                                selectedPlaceForMove?.id === place.id
                                  ? 'border border-[var(--Blue-Scale-blue-500)] bg-[var(--Blue-Scale-blue-100)] text-[var(--Blue-Scale-blue-500)]'
                                  : 'bg-[var(--Grey-Scale-grey-100)] text-[var(--Grey-Scale-grey-300)]'
                              }`}
                            >
                              <span>{place.name}</span>
                            </div>
                          </button>
                        )
                      })
                    })()}
                  </div>
                  <button
                    onClick={handleConfirmMove}
                    disabled={!selectedPlaceForMove}
                    className={`mt-4 w-full rounded-lg py-3 text-white ${
                      selectedPlaceForMove
                        ? 'bg-[var(--Blue-Scale-blue-500)]'
                        : 'cursor-not-allowed bg-gray-300'
                    }`}
                  >
                    사진 옮기기
                  </button>
                </div>
              </div>
            )}
          </div>,
          document.getElementById('root'),
        )}
    </div>
  )
}

export default PhotoAlbum
