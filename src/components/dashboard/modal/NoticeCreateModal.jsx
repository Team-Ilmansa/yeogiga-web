import CloseIcon from '@/assets/dashboard/notice/CloseIcon'
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/** 공지 작성 모달 */
const NoticeCreateModal = ({
  open,
  onClose,
  onSubmit,
  initialTitle = '',
  initialDesc = '',
  submitting = false,
}) => {
  const TITLE_MAX = 20
  const DESC_MAX = 100

  const [title, setTitle] = useState(initialTitle)
  const [desc, setDesc] = useState(initialDesc)
  const titleRef = useRef(null)

  useEffect(() => {
    if (open) {
      setTitle(initialTitle)
      setDesc(initialDesc)
      setTimeout(() => titleRef.current?.focus(), 0)
    }
  }, [open, initialTitle, initialDesc])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original || ''
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  const canSubmit =
    title.trim().length > 0 &&
    title.trim().length <= TITLE_MAX &&
    desc.trim().length > 0 &&
    desc.trim().length <= DESC_MAX

  const submit = async () => {
    if (!canSubmit || submitting) return
    await onSubmit?.({ title: title.trim(), description: desc.trim() })
    window.location.reload()
  }

  return createPortal(
    <div className='fixed inset-0 z-[9999] flex items-center justify-center'>
      <div
        className='absolute inset-0 bg-black/50'
        onClick={onClose}
        aria-hidden='true'
      />
      <div
        className='relative z-10 flex h-[500px] w-[380px] flex-col justify-center rounded-2xl border border-gray-100 bg-white p-4 shadow-xl'
        role='dialog'
        aria-modal='true'
        onClick={(e) => e.stopPropagation()}
      >
        {/** 닫기 버튼 */}
        <button
          type='button'
          aria-label='닫기'
          onClick={onClose}
          className='absolute top-3 right-3 rounded-full border-none bg-transparent p-1 text-gray-400 hover:bg-gray-100'
        >
          <CloseIcon />
        </button>

        {/** 헤더 */}
        <div className='mt-8 mb-4'>
          <h2 className='text-xl font-semibold text-gray-900'>공지하기</h2>
          <p className='mt-1 text-sm text-gray-500'>
            팀원들에게 공지를 보낼 수 있어요
          </p>
        </div>

        {/** 제목, 글자수 카운터 */}
        <div className='relative mb-6'>
          <input
            ref={titleRef}
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='제목을 작성해주세요'
            maxLength={TITLE_MAX}
            className='w-full rounded-[15px] border-none bg-[var(--Grey-Scale-grey-100)] p-4 text-base outline-none placeholder:text-gray-400'
            aria-describedby='notice-title-counter'
          />
          <div
            id='notice-title-counter'
            className='pointer-events-none absolute right-1 -bottom-5 text-xs text-gray-300'
          >
            {title.length}/{TITLE_MAX}
          </div>
        </div>

        {/** 내용, 글자수 카운터 */}
        <div className='relative mb-4'>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder='공지사항을 작성해주세요'
            rows={6}
            maxLength={DESC_MAX}
            className='mt-4 w-full resize-none rounded-[15px] border-none bg-[var(--Grey-Scale-grey-100)] p-4 text-base outline-none placeholder:text-gray-400'
            aria-describedby='notice-desc-counter'
          />
          <div
            id='notice-desc-counter'
            className='pointer-events-none absolute right-1 -bottom-5 text-xs text-gray-300'
          >
            {desc.length}/{DESC_MAX}
          </div>
        </div>

        {/** 확인 버튼 */}
        <div className='mt-6 flex w-full justify-end'>
          <button
            type='button'
            className='min-w-[120px] rounded-xl border-none bg-[var(--Blue-Scale-blue-500)] px-5 py-3 text-base font-semibold text-white disabled:opacity-60'
            onClick={submit}
            disabled={!canSubmit || submitting}
            aria-label='공지 작성 확인'
          >
            확인
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default NoticeCreateModal
