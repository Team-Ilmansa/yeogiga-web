/**지난여행 돌아보기 */
const PastTrips = () => {
  const imageList = [
    'https://placehold.co/400x400?text=Spot+1',
    'https://placehold.co/400x400?text=Spot+2',
    'https://placehold.co/400x400?text=Spot+3',
    'https://placehold.co/400x400?text=Spot+4',
    'https://placehold.co/400x400?text=Spot+5',
  ]

  return (
    <div className='w-full pl-10'>
      <div className='pb-3 text-2xl font-bold text-[var(--Grey-Scale-grey-400)]'>
        지난여행 돌아보기
      </div>

      {/* 장소 이미지 */}
      <div className='scrollbar-hide flex gap-4 overflow-x-auto'>
        {imageList.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`여행 이미지 ${idx + 1}`}
            className='h-[400px] w-[400px] flex-shrink-0 rounded-xl object-cover'
          />
        ))}
      </div>
    </div>
  )
}

export default PastTrips
