import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

/**여행 장소 추천 */
const RecommendedPlaces = ({ user }) => {
  const imageList = [
    {
      id: 1,
      name: '고요한 해변',
      src: 'https://picsum.photos/seed/beach/400/300',
    },
    {
      id: 2,
      name: '푸르른 산맥',
      src: 'https://picsum.photos/seed/mountain/400/300',
    },
    {
      id: 3,
      name: '활기찬 도시',
      src: 'https://picsum.photos/seed/city/400/300',
    },
    {
      id: 4,
      name: '신비로운 숲',
      src: 'https://picsum.photos/seed/forest/400/300',
    },
    {
      id: 5,
      name: '아늑한 시골 마을',
      src: 'https://picsum.photos/seed/village/400/300',
    },
  ]

  return (
    <div className='w-full pl-10'>
      <div className='pb-3 text-2xl font-bold text-[var(--Grey-Scale-grey-400)]'>
        {user?.nickname}님께 딱 맞을 것 같은 스팟
      </div>

      <Swiper slidesPerView={1.8} spaceBetween={16} className='w-full'>
        {imageList.map((image) => (
          <SwiperSlide key={image.id}>
            <img
              src={image.src}
              alt={image.name}
              className='h-[300px] w-full rounded-xl object-cover'
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default RecommendedPlaces
