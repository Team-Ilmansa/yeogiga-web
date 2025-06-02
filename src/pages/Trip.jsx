import { useParams } from 'react-router-dom'

const Trip = () => {
  const { tripId } = useParams()

  return <div>{tripId}번 여행</div>
}

export default Trip
