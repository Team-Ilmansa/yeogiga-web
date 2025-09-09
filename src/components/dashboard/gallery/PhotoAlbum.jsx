import NoUploadImage from '@/assets/dashboard/NoUploadImage'
import { Check } from 'lucide-react'

const PhotoAlbum = ({
  temporaryImages,
  unmatchedImages,
  matchedImages,
  isSelectionMode,
  selectedImages,
  toggleSelectionMode,
  handleImageClick,
}) => {
  const hasTemporaryImages = temporaryImages && temporaryImages.length > 0
  const hasMatchedImages = matchedImages && matchedImages.length > 0
  const hasUnmatchedImages = unmatchedImages && unmatchedImages.length > 0
  const totalImages =
    hasMatchedImages || hasUnmatchedImages
      ? matchedImages.reduce((acc, place) => acc + place.images.length, 0) +
        unmatchedImages.length
      : 0

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
                  <div key={image.id} className='relative aspect-square'>
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
                <div key={image.id} className='relative aspect-square'>
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
    </div>
  )
}

export default PhotoAlbum
