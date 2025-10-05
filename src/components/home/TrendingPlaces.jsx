import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

/**홈 화면 인기 급상승 여행 스팟 */
const TrendingPlaces = () => {
  const imageList = [
    {
      id: 1,
      name: '노을 지는 사막',
      src: 'https://picsum.photos/seed/desert/250/250',
    },
    {
      id: 2,
      name: '고층 빌딩 스카이라인',
      src: 'https://picsum.photos/seed/skyline/250/250',
    },
    {
      id: 3,
      name: '한적한 호숫가',
      src: 'https://picsum.photos/seed/lake/250/250',
    },
    {
      id: 4,
      name: '역사적인 건축물',
      src: 'https://picsum.photos/seed/architecture/250/250',
    },
    {
      id: 5,
      name: '눈 덮인 설산',
      src: 'https://picsum.photos/seed/snow/250/250',
    },
    {
      id: 6,
      name: '열대 우림',
      src: 'https://picsum.photos/seed/jungle/250/250',
    },
    {
      id: 7,
      name: '화려한 야경',
      src: 'https://picsum.photos/seed/night/250/250',
    },
    {
      id: 8,
      name: '광활한 초원',
      src: 'https://picsum.photos/seed/grassland/250/250',
    },
    {
      id: 9,
      name: '고대의 유적',
      src: 'https://picsum.photos/seed/ruins/250/250',
    },
    {
      id: 10,
      name: '신비로운 동굴',
      src: 'https://picsum.photos/seed/cave/250/250',
    },
  ]

  const slides = imageList.reduce((acc, curr, i) => {
    if (i % 2 === 0) {
      acc.push([curr])
    } else {
      acc[acc.length - 1].push(curr)
    }
    return acc
  }, [])

  return (
    <div className='w-full pl-10'>
      <div className='pb-3 text-2xl font-bold text-[var(--Grey-Scale-grey-400)]'>
        인기 급상승 여행스팟
      </div>

      <Swiper
        slidesPerView={2.8}
        spaceBetween={16}
        className='h-[520px] w-full'
      >
        {slides.map((pair, index) => (
          <SwiperSlide key={index}>
            <div className='flex flex-col gap-4'>
              {pair.map((image) => (
                <img
                  key={image.id}
                  src={image.src}
                  alt={image.name}
                  className='h-[250px] w-full rounded-xl object-cover'
                />
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default TrendingPlaces
