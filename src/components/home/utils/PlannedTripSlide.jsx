import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y } from 'swiper/modules'
import 'swiper/css'
import TripPreviewCard from '@/components/home/common/TripPreviewCard'

/**준비 중인 여행 목록 가로 슬라이드 */
const PlannedTripSlide = ({ settingTrips = [] }) => {
  if (!Array.isArray(settingTrips) || settingTrips.length === 0) return null
  const swiperRef = useRef(null)

  return (
    <section className='w-full pl-10'>
      <div className='mb-3 flex items-center justify-between px-1'>
        <h2 className='text-2xl font-bold text-gray-900'>
          {settingTrips.length}개의 준비중인 여행
        </h2>
      </div>

      <Swiper
        modules={[A11y]}
        onSwiper={(s) => (swiperRef.current = s)}
        onBeforeDestroy={() => (swiperRef.current = null)}
        slidesPerView={1.8}
        spaceBetween={16}
        slidesOffsetBefore={8}
        slidesOffsetAfter={8}
        centeredSlides={false}
        className='w-full'
      >
        {settingTrips.map((trip) => (
          <SwiperSlide key={trip.tripId} className='!h-auto'>
            <Link to={`/trip/${trip.tripId}`}>
              <div className='h-full'>
                <TripPreviewCard trip={trip} />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default PlannedTripSlide
