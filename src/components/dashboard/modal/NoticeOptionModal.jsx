import { createPortal } from 'react-dom'
import { useEffect } from 'react'
import TrashIcon from '@/assets/dashboard/notice/TrashIcon'
import MegaPhoneIcon from '@/assets/dashboard/notice/MegaPhoneIcon'
import PenIcon from '@/assets/settlement/PenIcon'

/** 공지 옵션 모달 */
const NoticeOptionsModal = ({
  isOpen,
  onClose,
  onComplete,
  onDelete,
  onEdit,
}) => {
  useEffect(() => {
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollBarWidth}px`

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = 'auto'
      document.body.style.paddingRight = '0px'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const buttonStyle =
    'border-none outline-none focus:outline-none ring-0 flex items-center gap-3 text-left text-base font-medium text-gray-800 w-full py-3.5 px-0'
  const TextStyle = 'text-base font-medium text-gray-800'

  return createPortal(
    <div
      className='absolute inset-0 z-[999] flex items-end justify-center'
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleBackgroundClick}
      role='dialog'
      aria-modal='true'
    >
      <div className='mr-1 box-border w-[56rem] max-w-full rounded-t-2xl bg-white px-7 pt-5 pb-10 shadow-md'>
        {/** 상단 바 */}
        <div
          className='mx-auto mb-5 h-1.5 w-40 cursor-pointer rounded bg-gray-200'
          onClick={onClose}
          role='button'
          aria-label='모달 닫기'
        />

        {/** 버튼들 */}
        <div className='flex flex-col gap-4'>
          <button onClick={onComplete} className={buttonStyle}>
            <MegaPhoneIcon className={TextStyle} />
            공지 완료하기
          </button>
          <button onClick={onEdit} className={buttonStyle}>
            <PenIcon className={TextStyle} />
            공지 수정하기
          </button>
          <button onClick={onDelete} className={buttonStyle}>
            <TrashIcon className={TextStyle} />
            공지 삭제하기
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default NoticeOptionsModal
