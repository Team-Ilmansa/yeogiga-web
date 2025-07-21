import { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import DateBox from './\bDateBox'

const DayTabs = () => {
  const [activeTab, setActiveTab] = useState(0)
  const contentSwiperRef = useRef(null)

  /** 추후 일정 개수에 따라 확장 가능 */
  const tabList = [{ label: '여행 전체' }]

  const handleTabClick = (index) => {
    setActiveTab(index)
    contentSwiperRef.current?.slideTo(index)
  }

  return (
    <div className='w-full'>
      {/* 탭 바 */}
      <div className='flex flex-wrap gap-[6px]'>
        {tabList.map((tab, index) => {
          const isActive = index === activeTab
          return (
            <div
              key={tab.label}
              onClick={() => handleTabClick(index)}
              className={`cursor-pointer rounded-full px-4 py-1 text-base ${
                isActive
                  ? 'bg-[var(--Blue-Scale-blue-500)] text-white'
                  : 'border border-gray-300 bg-white text-gray-500'
              }`}
            >
              {tab.label}
            </div>
          )
        })}
      </div>

      {/* 콘텐츠 영역 */}
      <div className='mt-4'>
        <div className='flex flex-col gap-3'>
          <DateBox />
        </div>
      </div>
    </div>
  )
}

export default DayTabs
