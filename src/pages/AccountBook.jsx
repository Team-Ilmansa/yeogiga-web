import GoBack from '@/assets/sign-up/GoBack'
import { useNavigate, useParams } from 'react-router-dom'

const AccountBook = () => {
  const { tripId } = useParams()
  const navigate = useNavigate()

  /**뒤로 가기 버튼 */
  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className='flex w-full flex-col pt-5'>
      <div className='mb-5 flex items-center justify-between px-8'>
        <button className='border-none' onClick={handleBack}>
          <GoBack />
        </button>
      </div>
      <div className='flex w-full flex-col gap-15 pt-10 pb-50 pl-10'>
        <h1 className='text-4xl leading-normal font-bold'>마이페이지</h1>
      </div>
    </div>
  )
}

export default AccountBook
