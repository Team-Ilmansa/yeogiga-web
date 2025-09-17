/**홈 화면 인기 급상승 여행 스팟 */
const TrendingPlaces = () => {
  const imageList = [
    'https://placehold.co/250x250?text=Spot+1',
    'https://placehold.co/250x250?text=Spot+2',
    'https://placehold.co/250x250?text=Spot+3',
    'https://placehold.co/250x250?text=Spot+4',
    'https://placehold.co/250x250?text=Spot+5',
    'https://placehold.co/250x250?text=Spot+6',
    'https://placehold.co/250x250?text=Spot+7',
    'https://placehold.co/250x250?text=Spot+8',
    'https://placehold.co/250x250?text=Spot+9',
    'https://placehold.co/250x250?text=Spot+10',
  ]

  return (
    <div className='w-full pl-10'>
      <div className='pb-3 text-2xl font-bold text-[var(--Grey-Scale-grey-400)]'>
        인기 급상승 여행스팟
      </div>

      {/* 장소 이미지 10개 출력 */}
      <div className='scrollbar-hide flex flex-col gap-4 overflow-x-auto'>
        <div className='flex gap-4'>
          {imageList.slice(0, 5).map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`추천 이미지 ${idx + 1}`}
              className='flex-shrink-0 rounded-xl object-cover'
            />
          ))}
        </div>
        <div className='flex gap-4'>
          {imageList.slice(5).map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`추천 이미지 ${idx + 1}`}
              className='flex-shrink-0 rounded-xl object-cover'
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TrendingPlaces
