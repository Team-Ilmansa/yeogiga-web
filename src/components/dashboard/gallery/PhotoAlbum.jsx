import NoUploadImage from '@/assets/dashboard/NoUploadImage'

const PhotoAlbum = ({ temporaryImages }) => {
  return (
    <div className='relative pb-[100px]'>
      {temporaryImages.length > 0 ? (
        <div className='mt-2'>
          <p className='py-2 text-[var(--Blue-Scale-blue-500)]'>
            임시 저장 이미지 ({temporaryImages.length}장)
          </p>
          <div className='grid grid-cols-5 gap-1'>
            {temporaryImages.map((image, index) => (
              <div key={image.id || index} className='aspect-square'>
                <img
                  src={image.url}
                  alt={`temporary image ${index + 1}`}
                  className='h-full w-full rounded-2xl object-cover'
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
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
