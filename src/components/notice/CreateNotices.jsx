import createNoticeApi from '@/apis/notice/createNoticeApi'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const CreateNotices = () => {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const [titleNotices, setTitleNotices] = useState('')
  const [descNotices, setDescTitleNotices] = useState('')

  /**공지사항 생성 API 호출 */
  const createNotice = async () => {
    try {
      await createNoticeApi(tripId, {
        title: titleNotices,
        description: descNotices,
      })
    } catch (err) {
      alert(err.message)
    }
  }
  return (
    <div className='flex h-screen w-full flex-col items-center justify-center rounded-2xl px-6 py-5'>
      <div>
        <div className='flex w-[380px] flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-md'>
          <div className='flex justify-between'>
            <h2 className='mt-3 text-xl font-semibold text-gray-900'>
              공지사항을 작성할 수 있어요
            </h2>
          </div>
          {/** 제목 입력란 */}
          <input
            type='text'
            value={titleNotices}
            onChange={(e) => setTitleNotices(e.target.value)}
            placeholder='제목을 작성해주세요'
            className='w-full rounded-[20px] border-none bg-[var(--Grey-Scale-grey-100)] p-4 text-base outline-none'
          />

          {/** 내용 입력 */}
          <textarea
            value={descNotices}
            onChange={(e) => setDescTitleNotices(e.target.value)}
            placeholder='공지사항을 작성해주세요'
            rows={6}
            className='w-full resize-none rounded-[20px] bg-[var(--Grey-Scale-grey-100)] p-4 text-base outline-none'
          ></textarea>

          <div className='flex w-full gap-3'>
            <button
              className='font-large text-m text-grey-400 w-1/2 rounded-xl border-none bg-gray-100 px-4 py-3 font-semibold outline-none'
              onClick={() => navigate('/')}
            >
              취소
            </button>
            <button
              className='font-large text-m w-1/2 rounded-xl border-none bg-[var(--Blue-Scale-blue-500)] px-4 py-3 font-semibold text-white outline-none'
              onClick={createNotice}
            >
              작성하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateNotices
