import ImageUploadIcon from '@/assets/dashboard/ImageUploadIcon'
import NoUploadImage from '@/assets/dashboard/NoUploadImage'
const PhotoAlbum = () => {
  return (
    <>
      <div className='relative min-h-screen bg-gray-50 pb-[100px]'>
        {/** 임시 콘텐츠 */}
        <div className='p-4'>
          <p className='text-center text-gray-500'>사진 앨범 콘텐츠 영역</p>
          {/** 내용이 많아졌을 때 스크롤 테스트용 */}
          <div style={{ height: '1000px' }}></div>
        </div>
      </div>
      {/** 하단 고정 업로드 버튼 */}
      <div className='fixed bottom-0 left-0 z-10 w-full bg-white px-[20px] py-[16px] shadow-[0_-2px_4px_rgba(0,0,0,0.05)]'>
        <button className='w-full rounded-[20px] bg-[var(--Blue-Scale-blue-500)] py-[16px] text-white'>
          <div className='flex items-center justify-center gap-x-2'>
            <ImageUploadIcon />
            <span className='text-base font-medium'>사진 업로드하기</span>
          </div>
        </button>
      </div>
    </>
  )
}

export default PhotoAlbum
