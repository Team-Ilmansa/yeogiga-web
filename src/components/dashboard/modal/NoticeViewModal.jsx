import CloseIcon from '@/assets/dashboard/notice/CloseIcon'
import { createPortal } from 'react-dom'
import { useEffect } from 'react'

/** 공지 상세 모달 */
const NoticeViewModal = ({ open, notice, onClose }) => {
  /** ESC & 스크롤 락 */
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

  if (!open || !notice) return null

  return createPortal(
    <div className='fixed inset-0 z-[9999] flex items-center justify-center'>
      <div
        className='absolute inset-0 bg-black/50'
        onClick={onClose}
        aria-hidden='true'
      />
      <div
        className='relative z-10 flex h-auto max-h-[80vh] w-[380px] max-w-[90%] flex-col overflow-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-xl'
        role='dialog'
        aria-modal='true'
        onClick={(e) => e.stopPropagation()}
      >
        {/** 닫기 버튼 */}
        <button
          type='button'
          aria-label='닫기'
          onClick={onClose}
          className='absolute top-5 right-3 rounded-full border-none bg-transparent p-1 text-gray-400 hover:bg-gray-100'
        >
          <CloseIcon />
        </button>

        {/** 제목 */}
        <div className='mt-8 mb-3'>
          <h2 className='text-xl font-semibold text-gray-900'>
            {' '}
            {notice.title || '제목 없음'}
          </h2>
        </div>

        {/** 내용 */}
        <div className='relative mb-2'>
          <div
            className='max-h-[230px] w-full overflow-auto rounded-[15px] text-sm whitespace-pre-wrap text-gray-700'
            style={{ wordBreak: 'break-word' }}
          >
            {notice.description || '내용 없음'}
          </div>
        </div>

        {/** 확인 버튼 */}
        <div className='mt-4 flex w-full justify-end'>
          <button
            type='button'
            className='min-w-[120px] rounded-xl border-none bg-[var(--Blue-Scale-blue-500)] px-5 py-3 text-base text-white'
            onClick={onClose}
          >
            확인
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default NoticeViewModal
