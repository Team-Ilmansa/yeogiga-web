import GoBack from '@/assets/sign-up/GoBack'
import CategorySelector from '@/components/common/CategorySelector'
import FixedActionBar from '@/components/common/FixedActionBar'
import React, { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const SettlementAdd = () => {
  const navigate = useNavigate()
  const { tripId, userId } = useParams()

  const [amount, setAmount] = useState('')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState({ y: '', m: '', d: '' })
  const [category, setCategory] = useState('ETC')

  const handleBack = () => navigate(-1)

  const isConfirmEnabled = useMemo(() => {
    return !!title.trim() && !!amount && !!date.y && !!date.m && !!date.d
  }, [title, amount, date])

  const handleConfirm = () => {
    if (!isConfirmEnabled) return
    navigate(-1)
  }

  const inputStyle =
    'h-18 w-full rounded-2xl bg-gray-100 px-4 pr-12 text-xl placeholder:text-gray-400 border-none outline-none'
  const titleStyle = 'mb-2 text-xl text-gray-800'
  const dotStyle = 'self-end text-4xl text-gray-500'

  return (
    <div className='flex w-full flex-col pt-5'>
      {/* 헤더 */}
      <div className='relative mb-5 flex items-center px-8'>
        <button className='border-none' onClick={handleBack}>
          <GoBack />
        </button>
        <div className='absolute left-1/2 -translate-x-1/2 text-lg font-semibold'>
          정산 내역 추가하기
        </div>
      </div>

      {/* 본문 */}
      <div className='space-y-6 px-10'>
        {/* 정산 비용 */}
        <div>
          <div className={titleStyle}>정산 비용</div>
          <div className='relative'>
            <input
              type='text'
              inputMode='numeric'
              pattern='[0-9]*'
              value={amount}
              onChange={(e) => {
                // 숫자만 유지
                const onlyNum = e.target.value.replace(/[^0-9]/g, '')
                setAmount(onlyNum)
              }}
              placeholder='금액을 입력해주세요'
              className={inputStyle}

            />
            <span className='pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xl text-gray-500'>
              원
            </span>
          </div>
        </div>

        {/* 내역 이름 */}
        <div>
          <div className={titleStyle}>내역 이름</div>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='내역 이름을 입력해주세요'
            className={inputStyle}

          />
        </div>

        {/* 날짜 */}
        <div>
          <div className={titleStyle}>날짜</div>
          <div className='flex items-center gap-2'>
            {/* YYYY */}

            <input
              type='text'
              inputMode='numeric'
              maxLength={4}
              placeholder='YYYY'

              value={date.y}
              onChange={(e) =>
                setDate((prev) => ({
                  ...prev,
                  y: e.target.value.replace(/[^0-9]/g, ''),
                }))
              }
              className={inputStyle}
            />
            <span className={dotStyle}>.</span>

            {/* MM */}
            <input
              type='text'
              inputMode='numeric'
              maxLength={2}
              placeholder='MM'

              value={date.m}
              onChange={(e) =>
                setDate((prev) => ({
                  ...prev,
                  m: e.target.value.replace(/[^0-9]/g, ''),
                }))
              }
              className={inputStyle}
            />
            <span className={dotStyle}>.</span>

            {/* DD */}
            <input
              type='text'
              inputMode='numeric'
              maxLength={2}
              placeholder='DD'
              value={date.d}
              onChange={(e) =>
                setDate((prev) => ({
                  ...prev,
                  d: e.target.value.replace(/[^0-9]/g, ''),
                }))
              }
              className={inputStyle}
            />
          </div>
        </div>
        {/** 카테고리 선택 */}
        <div className={titleStyle}>카테고리</div>
        <CategorySelector value={category} onChange={setCategory} size={50} />
        {/** 정산 인원 */}
        <div className={titleStyle}>정산 인원</div>
      </div>
      <FixedActionBar className='flex justify-center'>
        <div className='flex w-4xl items-center justify-center rounded-t-[20px] bg-white p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
          <button
            onClick={handleConfirm}
            disabled={!isConfirmEnabled}
            className={`w-full rounded-lg border-none p-[20px] text-2xl text-white ${isConfirmEnabled ? 'bg-[var(--Blue-Scale-blue-500)]' : 'cursor-not-allowed bg-gray-300'}`}
          >
            확인
          </button>
        </div>
      </FixedActionBar>
    </div>
  )
}

export default SettlementAdd