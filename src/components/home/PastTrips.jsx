import { MapPin, Calendar } from 'lucide-react'
import UserIcon from '@/assets/home/UserIcon'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import getCityImage from '@/assets/common/CityImageMap'

/**지난여행 돌아보기 */
const PastTrips = ({ pastTrips = [], loadMore }) => {
  const formatDate = (d) =>
    new Date(d).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })

  return (
    <div className='w-full pl-10'>
      <div className='pb-3 text-2xl font-bold text-[var(--Grey-Scale-grey-400)]'>
        지난여행 돌아보기
      </div>

      <Swiper
        slidesPerView={1.8}
        spaceBetween={16}
        className='w-full'
        onReachEnd={() => {
          if (pastTrips.length >= 3) {
            loadMore()
          }
        }}
      >
        {pastTrips.map((trip) => {
          const mappedImage = getCityImage(trip.city)

          return (
            <SwiperSlide key={trip.tripId}>
              <Link to={`/trip/${trip.tripId}`}>
                <div
                  className='relative flex h-100 w-full flex-shrink-0 flex-col justify-end overflow-hidden rounded-xl p-6'
                  style={{
                    backgroundImage: `url(${mappedImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className='pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-transparent via-black/20 to-black/70' />

                  <div className='relative z-10 text-white'>
                    <h3 className='mb-4 truncate text-3xl font-bold'>
                      {trip.title}
                    </h3>
                    <div className='flex items-center gap-2 text-lg'>
                      <MapPin className='h-5 w-5' />
                      <span>
                        {Array.isArray(trip.city) && trip.city.length > 0
                          ? trip.city.join(', ')
                          : '아직 정해지지 않았어요'}
                      </span>
                    </div>
                    <div className='mb-1 flex items-center gap-2 text-lg'>
                      <Calendar className='h-5 w-5' />
                      <span>
                        {trip.startedAt && trip.endedAt
                          ? `${formatDate(trip.startedAt)} - ${formatDate(
                              trip.endedAt,
                            )}`
                          : '아직 정해지지 않았어요'}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <UserIcon color={'white'} size={20} />
                      <div className='flex items-center'>
                        {trip.members.map((member) => (
                          <img
                            key={member.userId}
                            src={member.imageUrl}
                            alt={member.nickname}
                            className='h-6 w-6 rounded-full border-2 border-white first:ml-0'
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

export default PastTrips
