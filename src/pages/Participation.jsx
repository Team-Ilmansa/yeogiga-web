import createMemberApi from '@/apis/member/createMemberApi'
import readTripInfoApi from '@/apis/trip/readTripInfo'
import ShareIcon from '@/assets/dashboard/modal/ShareIcon'
import TravelBag from '@/assets/dashboard/modal/TravelBag'
import GoBack from '@/assets/sign-up/GoBack'
import FixedActionBar from '@/components/common/FixedActionBar'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

/** 초대 수락 페이지 */
const Participation = () => {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const [tripInfo, setTripInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTripInfo = async () => {
      try {
        const result = await readTripInfoApi(tripId)
        setTripInfo(result.data)
      } catch (err) {
        alert(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (tripId) fetchTripInfo()
  }, [tripId])

  const createMember = async () => {
    try {
      await createMemberApi(tripId)
      alert('여행에 참가하였습니다!')
      navigate(`/trip/${tripId}`)
    } catch (err) {
      alert(err.message)
    }
  }

  const ButtonStyle =
    'flex-1 rounded-lg px-5 py-5 text-xl font-semibold border-0'

  return (
    <div className='flex h-screen w-full flex-col bg-white'>
      {/**헤더 */}
      <div className='flex w-full flex-col'>
        <div className='flex items-center justify-between px-8 pt-3 pb-2'>
          <button
            className='border-none outline-none focus:outline-none'
            onClick={() => navigate('/')}
          >
            <GoBack />
          </button>
        </div>

        {/**본문 */}
        <div className='mt-20 flex flex-grow flex-col items-center justify-center bg-white px-10 py-10'>
          {loading ? (
            <p className='text-sm text-gray-500'>여행 정보를 불러오는 중...</p>
          ) : (
            <div className='mx-auto flex w-full max-w-[420px] flex-col items-center text-center'>
              <div className='mb-4 grid h-40 w-40 place-items-center rounded-full bg-[rgba(113,97,255,0.08)]'>
                <div className='grid h-30 w-30 place-items-center rounded-full bg-[rgba(113,97,255,0.12)]'>
                  <ShareIcon />
                </div>
              </div>

              <h1 className='mt-6 text-4xl font-bold text-gray-900'>
                여행 초대
              </h1>
              <p className='mt-7 text-xl leading-relaxed font-medium text-gray-500'>
                여행에 초대되었습니다. <br />
                참가하시겠습니까?
              </p>

              {tripInfo && (
                <div className='mt-8 inline-flex items-center gap-2 rounded-2xl border border-[rgba(113,97,255,0.12)] bg-[rgba(113,97,255,0.06)] px-5 py-4'>
                  <TravelBag />
                  <span className='text-m font-semibold text-[var(--Blue-Scale-blue-500)]'>
                    {tripInfo.title || '여행'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/**하단 고정 바 */}
      <FixedActionBar className='bg-transparent'>
        <div
          className='w-full'
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className='flex w-full justify-center'>
            <div className='flex w-4xl items-center justify-center rounded-t-[20px] bg-white p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
              <div className='flex w-full gap-3'>
                <button
                  type='button'
                  onClick={() => navigate('/')}
                  className={`${ButtonStyle} bg-gray-100 text-gray-700`}
                >
                  거절
                </button>
                <button
                  type='button'
                  onClick={createMember}
                  className={`${ButtonStyle} bg-[var(--Blue-Scale-blue-500)] text-white`}
                  aria-label='초대 수락'
                >
                  참가하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </FixedActionBar>
    </div>
  )
}

export default Participation
