import TripTitle from '@/components/dashboard/TripTitle'
import GoBack from '@/assets/sign-up/GoBack'
import { useNavigate, useParams } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()
  const { tripId } = useParams()

  /**뒤로 가기 버튼 */
  const handleBack = () => {
    navigate(`/trip/${tripId}`)
  }

  return (
    <div className='flex w-full flex-col pt-5'>
      {/* 뒤로 가기 버튼 */}
      <div>
        <button
          className='text-bold my-2 border-none px-4'
          onClick={handleBack}
        >
          <GoBack />
        </button>
      </div>

      {/* 여행 타이틀 */}
      <div className='flex w-full flex-col gap-15 pt-10 pb-10 pl-10'>
        <TripTitle />
      </div>
    </div>
  )
}

export default Dashboard
