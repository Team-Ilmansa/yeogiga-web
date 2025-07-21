import ArrowUp from '@/assets/dashboard/ArrowUp'
import ArrowDown from '@/assets/dashboard/ArrowDown'
import { useState } from 'react'

const DateBox = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => setIsOpen((prev) => !prev)

  return (
    <div className='w-full rounded-[20px] border border-gray-300 bg-white px-4 py-3 drop-shadow'>
      <div
        className='flex cursor-pointer items-center justify-between'
        onClick={toggleOpen}
      >
        <div className='text-[16px] text-gray-500'>Date</div>
        {isOpen ? (
          <ArrowUp
            className='text-gray-400 transition-transform duration-300'
            size={18}
          />
        ) : (
          <ArrowDown
            className='text-gray-400 transition-transform duration-300'
            size={18}
          />
        )}
      </div>

      {isOpen && (
        <div className='mt-[5px] py-10 text-center text-base text-gray-400'>
          아직 예정된 일정이 없어요
          <div className='mt-2 text-base text-[var(--Blue-Scale-blue-500)]'>
            + 일정 담으러 가기
          </div>
        </div>
      )}
    </div>
  )
}

export default DateBox
