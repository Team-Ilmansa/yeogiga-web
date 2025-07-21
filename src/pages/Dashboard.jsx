import TripTitle from '@/components/dashboard/TripTitle'
import GoBack from '@/assets/sign-up/GoBack'
import { useNavigate, useParams } from 'react-router-dom'
import SlideTabs from '@/components/dashboard/SlideTabs'

const Dashboard = () => {
  const navigate = useNavigate()
  const { tripId } = useParams()

  const handleBack = () => {
    navigate(`/trip/${tripId}`)
  }

  return (
    <div className='flex w-full flex-col pt-5'>
      <div>
        <button
          className='text-bold my-2 border-none px-4'
          onClick={handleBack}
        >
          <GoBack />
        </button>
      </div>

      <div className='flex w-full flex-col gap-15 px-10 pt-10 pb-10'>
        <TripTitle />
        <SlideTabs />
      </div>
    </div>
  )
}

export default Dashboard
