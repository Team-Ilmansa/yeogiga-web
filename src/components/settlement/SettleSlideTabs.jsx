import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Scrollbar } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/scrollbar'

import readSettlementApi from '@/apis/settlement/readSettlementApi'
import UnsettledList from '@/components/settlement/UnsettledList'
import SettledList from '@/components/settlement/SettledList'

const SettleSlideTabs = () => {
  const { tripId, settlementId, userId } = useParams()
  const currentUserId = userId ? Number(userId) : undefined

  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [payers, setPayers] = useState([])
  const swiperRef = useRef(null)

  /** 정산 상세 불러오기 */
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true)
        setError('')
        const result = await readSettlementApi(tripId, settlementId)
        const data = result.data
        setPayers(Array.isArray(data?.payers) ? data.payers : [])
      } catch (err) {
        console.error(err)
        setError('정산 내역을 불러오지 못했습니다.')
      } finally {
        setLoading(false)
        setTimeout(() => swiperRef.current?.update(), 0)
      }
    }

    if (tripId && settlementId) fetchDetail()
  }, [tripId, settlementId])

  /** 카운트/목록 메모 */
  const unsettledItems = useMemo(
    () => payers.filter((p) => !p.isCompleted),
    [payers],
  )
  const settledItems = useMemo(
    () => payers.filter((p) => Boolean(p.isCompleted)),
    [payers],
  )

  /** Swiper 핸들러 */
  const handleTabClick = (index) => {
    setActiveTab(index)
    swiperRef.current?.slideTo(index)
  }
  const updateSwiperHeight = () => {
    swiperRef.current?.update()
  }

  /** 로딩/에러 처리 */
  if (loading) {
    return (
      <div className='rounded-[20px] bg-white p-4 text-gray-500 shadow-sm'>
        불러오는 중...
      </div>
    )
  }

  if (error) {
    return (
      <div className='rounded-[20px] bg-white p-4 text-red-500 shadow-sm'>
        {error}
      </div>
    )
  }

  /** 탭 라벨 */
  const tabs = [
    { key: 'UNSETTLED', label: `미정산 ${unsettledItems.length}` },
    { key: 'SETTLED', label: `정산 완료 ${settledItems.length}` },
  ]

  return (
    <div className='w-full overflow-hidden'>
      {/* 탭 바 */}
      <div className='flex'>
        {tabs.map((tab, index) => {
          const isActive = activeTab === index
          return (
            <div
              key={tab.key}
              className='w-1/2 cursor-pointer select-none'
              onClick={() => handleTabClick(index)}
            >
              <div
                className='relative py-2 text-center font-medium'
                style={{ fontSize: '20px' }}
              >
                <div
                  style={{
                    color: isActive
                      ? 'var(--Blue-Scale-blue-500)'
                      : 'var(--Grey-Scale-grey-300)',
                  }}
                >
                  {tab.label}
                </div>
                <div className='absolute bottom-0 left-0 z-0 h-[4px] w-full bg-gray-100' />
                {isActive && (
                  <div
                    className='absolute bottom-0 left-0 z-10 h-[4px] w-full'
                    style={{ backgroundColor: 'var(--Blue-Scale-blue-500)' }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 콘텐츠 */}
      <Swiper
        modules={[Scrollbar]}
        autoHeight
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveTab(swiper.activeIndex)}
        slidesPerView={1}
        spaceBetween={0}
        allowTouchMove
        className='w-full overflow-hidden'
      >
        {/* 미정산 */}
        <SwiperSlide className='!w-full'>
          <div className='mt-5 w-full'>
            <UnsettledList
              items={unsettledItems}
              currentUserId={currentUserId}
              onContentUpdate={updateSwiperHeight}
            />
          </div>
        </SwiperSlide>

        {/* 정산 완료 */}
        <SwiperSlide className='!w-full'>
          <div className='mt-5 w-full'>
            <SettledList
              items={settledItems}
              currentUserId={currentUserId}
              onContentUpdate={updateSwiperHeight}
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  )
}

export default SettleSlideTabs
