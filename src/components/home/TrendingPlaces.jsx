import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useEffect, useState } from 'react'
import getTrendingPlaces from '@/apis/home/getTrendingPlaces'

/**홈 화면 인기 급상승 여행 스팟 */
const TrendingPlaces = () => {
  const [trendingPlaces, setTrendingPlaces] = useState([])

  useEffect(() => {
    const fetchTrendingPlaces = async () => {
      try {
        const result = await getTrendingPlaces()
        setTrendingPlaces(result.data)
      } catch (err) {
        console.err(err)
      }
    }
    fetchTrendingPlaces()
  }, [])

    const slides = trendingPlaces.reduce((acc, curr, i) => {
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
                {pair.map((place) => (
                  <div key={place.id} className='relative'>
                    <img
                      src={place.url}
                      alt={place.name}
                      className='h-[250px] w-full rounded-xl object-cover'
                    />
                    <div className='absolute bottom-0 left-0 right-0 rounded-b-xl bg-gradient-to-t from-black/70 to-transparent p-4 text-white'>
                      <div className='text-lg font-bold'>{place.name}</div>
                      <div className='text-sm'>{place.address}</div>
                    </div>
                  </div>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    )}

export default TrendingPlaces
