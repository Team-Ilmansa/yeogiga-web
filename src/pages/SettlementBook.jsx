import GoBack from '@/assets/sign-up/GoBack'
import FixedActionBar from '@/components/common/FixedActionBar'
import SettlementBox from '@/components/settlement/SettlementBox'
import SettlementTabs from '@/components/settlement/SettlementTabs'
import UnsettledTitle from '@/components/settlement/UnsettledTitle'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import readTripInfoApi from '@/apis/trip/readTripInfo'

const SettlementBook = () => {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const [view, setView] = useState({ key: 'ALL' })
  const [tripInfo, setTripInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  /** 여행 정보 불러오기 */
  useEffect(() => {
    const fetchTripData = async () => {
      if (!tripId) return
      try {
        setLoading(true)
        const response = await readTripInfoApi(tripId)
        setTripInfo(response.data)
      } catch (error) {
        console.error('여행 정보를 불러오는 데 실패했습니다:', error)
        navigate(-1)
      } finally {
        setLoading(false)
      }
    }
    fetchTripData()
  }, [tripId, navigate])

  const handleBack = () => navigate(-1)
  const handleOpenDetail = (settlementId) => {
    if (!settlementId) return
    navigate(`/trip/${tripId}/settlement/${settlementId}`)
  }

  if (loading) {
    return <div>여행 정보를 불러오는 중입니다...</div>
  }

  return (
    <>
      <div className='flex w-full flex-col pt-5'>
        <div className='mb-5 flex items-center justify-between px-8'>
          <button className='border-none' onClick={handleBack}>
            <GoBack />
          </button>
        </div>
        <div className='flex w-full flex-col gap-8 px-10'>
          <UnsettledTitle />
          {tripInfo?.startedAt && (
            <SettlementTabs
              onChange={setView}
              tripStartDate={tripInfo.startedAt}
            />
          )}

          <SettlementBox
            mode={view.key}
            date={view.date}
            onItemClick={handleOpenDetail}
          />
          <FixedActionBar className='flex justify-center'>
            <div className='flex w-4xl items-center justify-center rounded-t-[20px] bg-white p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
              <button
                onClick={() => navigate(`/trip/${tripId}/settlement/add`)}
                className='flex w-full items-center justify-center gap-2 rounded-lg border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
              >
                내역 추가하기
              </button>
            </div>
          </FixedActionBar>
        </div>
      </div>
    </>
  )
}

export default SettlementBook
