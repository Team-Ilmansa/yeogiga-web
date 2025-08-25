import TripPreviewCard from './common/TripPreviewCard'

/**준비중인 여행 목록 렌더링 */
const PlannedTrip = ({ settingTrips = [] }) => {
  if (!Array.isArray(settingTrips) || settingTrips.length === 0) return null

  return (
    <section className='mt-6'>
      <h2 className='mb-3 px-1 text-lg font-bold text-gray-900'>
        준비중인 여행
      </h2>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        {settingTrips.map((trip) => (
          <TripPreviewCard key={trip.tripId} trip={trip} />
        ))}
      </div>
    </section>
  )
}

export default PlannedTrip
