import { useState } from 'react'
import { createPortal } from 'react-dom'
import NoUploadImage from '@/assets/dashboard/NoUploadImage'
import updateFavoriteImageApi from '@/apis/image/updateFavoriteImageApi'
import {
  Check,
  ArrowLeft,
  ArrowRight,
  Download,
  Trash2,
  Heart,
} from 'lucide-react'

const PhotoAlbum = ({
  tripId,
  tripDayPlaceId,
  temporaryImages,
  unmatchedImages,
  matchedImages,
  isSelectionMode,
  selectedImages,
  toggleSelectionMode,
  handleImageClick,
}) => {
  const [modalImage, setModalImage] = useState(null)
  const hasTemporaryImages = temporaryImages && temporaryImages.length > 0
  const hasMatchedImages = matchedImages && matchedImages.length > 0
  const hasUnmatchedImages = unmatchedImages && unmatchedImages.length > 0
  const totalImages =
    hasMatchedImages || hasUnmatchedImages
      ? matchedImages.reduce((acc, place) => acc + place.images.length, 0) +
        unmatchedImages.length
      : 0

  /**매칭 이미지 + 매칭X(기타) 이미지 */
  const allImages = matchedImages
    .flatMap((place) =>
      place.images.map((image) => ({
        ...image,
        placeName: place.name,
        placeId: place.id,
      })),
    )
    .concat(unmatchedImages.map((image) => ({ ...image, placeName: '기타' })))

  /**모달 열기 */
  const openModal = (image) => {
    const imageWithPlace = allImages.find((img) => img.id === image.id)
    setModalImage(imageWithPlace)
  }

  /**모달 닫기 */
  const closeModal = () => {
    setModalImage(null)
  }

  /**다음 이미지 보기 */
  const showNextImage = (e) => {
    e.stopPropagation()
    const currentIndex = allImages.findIndex((img) => img.id === modalImage.id)
    const nextIndex = (currentIndex + 1) % allImages.length
    setModalImage(allImages[nextIndex])
  }

  /**이전 이미지 보기 */
  const showPrevImage = (e) => {
    e.stopPropagation()
    const currentIndex = allImages.findIndex((img) => img.id === modalImage.id)
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length
    setModalImage(allImages[prevIndex])
  }

  /**다운로드 함수 */
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
  }

  /**즐겨찾기 상태 변경 함수 */
  const handleFavoriteClick = async (e) => {
    e.stopPropagation()
    if (!modalImage) return

    const newIsFavorite = !modalImage.isFavorite
    const body = modalImage.placeId
      ? { placeId: modalImage.placeId, favorite: newIsFavorite }
      : { favorite: newIsFavorite }

    try {
      await updateFavoriteImageApi(tripId, tripDayPlaceId, modalImage.id, body)
      alert(
        newIsFavorite
          ? '즐겨찾기에 추가되었습니다.'
          : '즐겨찾기에서 해제되었습니다.',
      )
      setModalImage({ ...modalImage, isFavorite: newIsFavorite })
    } catch (err) {
      alert(err.message || '즐겨찾기 처리에 실패했습니다.')
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
              onClick={toggleSelectionMode}
              className={`flex items-center gap-1 border-none py-2 ${
                isSelectionMode || selectedImages.imageIds.length > 0
                  ? 'text-[var(--Blue-Scale-blue-500)]'
                  : 'text-[var(--Grey-Scale-grey-200)]'
              }`}
            >
              {selectedImages.imageIds.length > 0
                ? `${selectedImages.imageIds.length}개 선택됨`
                : '선택하기'}
              <Check className='h-4 w-4' />
            </button>
          </div>
          <div className='grid grid-cols-5 gap-1'>
            {temporaryImages.map((image) => (
              <div
                key={image.id}
                className='relative aspect-square cursor-pointer'
                onClick={() => handleImageClick(image)}
              >
                <img
                  src={image.url}
                  alt={`temporary image ${image.id}`}
                  className={'h-full w-full rounded-2xl object-cover'}
                />
                {selectedImages.imageIds.includes(image.id) && (
                  <div className='absolute inset-0 flex items-center justify-center rounded-2xl bg-[var(--Blue-Scale-blue-500)] opacity-50' />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {totalImages > 0 && (
        <div className={hasTemporaryImages ? 'mt-8' : 'mt-2'}>
          <p className='py-2 text-3xl font-bold text-[var(--Blue-Scale-blue-500)]'>
            {totalImages}장
          </p>

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
                  onClick={() => openModal(image)}
                >
                  <img
                    src={image.url}
                    alt={`matched image ${image.id}`}
                    className='h-full w-full rounded-2xl object-cover'
                  />
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
            className='bg-opacity-50 fixed inset-0 z-100 flex flex-col gap-5 bg-black/90 p-10'
            onClick={closeModal}
          >
            <div className='flex h-9/10 w-full items-center justify-between'>
              <button
                className='border-none text-white'
                onClick={showPrevImage}
              >
                <ArrowLeft size={48} />
              </button>
              <div className='flex h-full flex-col items-center justify-center p-10'>
                <div className='p-2 text-white'>{modalImage.placeName}</div>
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
            <div className='flex items-center justify-center text-white'>
              <button className='flex w-70 flex-col items-center justify-center gap-2 border-none'>
                <Trash2 size={48} />
                <span>삭제</span>
              </button>
              <div className='h-10 border-2 border-l border-white' />
              <button
                className='flex w-70 flex-col items-center justify-center gap-2 border-none'
                onClick={handleFavoriteClick}
              >
                <Heart
                  size={48}
                  fill={modalImage.favorite ? 'red' : 'none'}
                  color={modalImage.favorite ? 'red' : 'white'}
                />
                <span>즐겨찾기</span>
              </button>
              <div className='h-10 border-2 border-l border-white' />
              <button
                className='flex w-70 flex-col items-center justify-center gap-2 border-none'
                onClick={handleDownload}
              >
                <Download size={48} />
                <span>내 PC에 다운로드</span>
              </button>
            </div>
          </div>,
          document.getElementById('root'),
        )}
    </div>
  )
}

export default PhotoAlbum
