/**여행 장소 추천 */
const RecommendedPlaces = ({ user }) => {
  const imageList = [
    'https://placehold.co/500x300?text=Spot+1',
    'https://placehold.co/500x300?text=Spot+2',
    'https://placehold.co/500x300?text=Spot+3',
    'https://placehold.co/500x300?text=Spot+4',
    'https://placehold.co/500x300?text=Spot+5',
  ]

  return (
    <div className='w-full pl-10'>
      <div className='pb-3 text-2xl font-bold text-[var(--Grey-Scale-grey-400)]'>
        {user?.nickname}님께 딱 맞을 것 같은 스팟
      </div>

      {/* 장소 이미지 */}
      <div className='scrollbar-hide flex gap-4 overflow-x-auto'>
        {imageList.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`추천 이미지 ${idx + 1}`}
            className='h-[300px] w-[500px] flex-shrink-0 rounded-xl object-cover'
          />
        ))}
      </div>
    </div>
  )
}

export default RecommendedPlaces
