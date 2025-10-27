import { MapPin, Calendar } from 'lucide-react'

/**날짜 형식 설정을 위한 함수 */
const formatDate = (d) =>
  new Date(d)
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replaceAll('. ', '. ')
    .replace('.', '. ')

/**준비중인 여행을 렌더링하기 위한 카드 */
const TripPreviewCard = ({ trip }) => {
  /** 디데이 함수 */
  const calculateDday = (startDateString) => {
    if (!startDateString) return 'D-??'
    const today = new Date()
    const startDate = new Date(startDateString)

    today.setHours(0, 0, 0, 0)
    startDate.setHours(0, 0, 0, 0)

    const diffTime = startDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays > 0) return `D-${diffDays}`
    if (diffDays === 0) return 'D-Day'
    return `D+${Math.abs(diffDays)}`
  }

  return (
    <div className='w-full rounded-2xl bg-[var(--Blue-Scale-blue-100)] px-4 py-5 text-left shadow-sm transition'>
      {/** 상단: D-Day 배지 + 제목 */}

      <div className='mb-2 flex items-center gap-3'>
        <span className='inline-flex h-7 items-center rounded-full bg-white px-3 text-sm leading-none font-semibold text-[var(--Blue-Scale-blue-500)] shadow-sm'>
          {calculateDday(trip.startedAt)}
        </span>
        <h3 className='truncate text-[20px] leading-none font-extrabold text-gray-900'>
          {trip.title || '여행이름'}
        </h3>
      </div>

      {/** 위치 */}
      <div className='mt-2 flex items-center gap-2 text-[15px] text-gray-500'>
        <MapPin className='h-5 w-5' />
        <span>
          {trip.city.length > 0
            ? trip.city.join(', ')
            : '아직 정해지지 않았어요'}
        </span>
      </div>

      {/** 기간 */}
      <div className='mt-2 flex items-center gap-2 text-[15px] text-gray-500'>
        <Calendar className='h-5 w-5' />
        <span className='truncate'>
          {trip.startedAt && trip.endedAt
            ? `${formatDate(trip.startedAt)} - ${formatDate(trip.endedAt)}`
            : '아직 정해지지 않았어요'}
        </span>
      </div>
    </div>
  )
}

export default TripPreviewCard
