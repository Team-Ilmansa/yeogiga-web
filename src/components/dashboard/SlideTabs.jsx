import { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Scrollbar } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/scrollbar'
import ScheduleDashBoard from './schedule/ScheduleDashBoard'

const SlideTabs = () => {
  const [activeTab, setActiveTab] = useState(0)
  const contentSwiperRef = useRef(null)

  const tabList = [
    { label: '일정 대시보드' },
    { label: '갤러리', content: '갤러리 내용' },
    { label: '즐겨찾는 사진', content: '즐겨찾는 사진 내용' },
  ]

  const handleTabClick = (index) => {
    setActiveTab(index)
    if (contentSwiperRef.current) {
      contentSwiperRef.current.slideTo(index)
    }
  }

  return (
    <div className='w-full'>
      {/* 탭 바 */}
      <div className='flex'>
        {tabList.map((tab, index) => {
          const isActive = activeTab === index
          return (
            <div
              key={tab.label}
              className='w-1/3 cursor-pointer'
              onClick={() => handleTabClick(index)}
            >
              <div
                className='relative py-2 text-center font-medium select-none'
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

                <div className='absolute bottom-0 left-0 z-0 h-[4px] w-full bg-gray-100 shadow-none' />

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

      <Swiper
        onSwiper={(swiper) => (contentSwiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveTab(swiper.activeIndex)}
        slidesPerView={1}
        spaceBetween={0}
      >
        {tabList.map((tab, index) => (
          <SwiperSlide key={tab.label}>
            <div className='mt-5'>
              {index === 0 && <ScheduleDashBoard />}
              {index === 1 && <>🖼 갤러리 내용</>}
              {index === 2 && <>⭐ 즐겨찾는 사진 내용</>}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default SlideTabs
