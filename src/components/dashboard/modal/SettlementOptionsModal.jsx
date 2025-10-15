import { createPortal } from 'react-dom'
import { useEffect } from 'react'
import PenIcon from '@/assets/settlement/PenIcon'
import TrashIcon from '@/assets/dashboard/notice/TrashIcon'
import SpeakerIcon from '@/assets/settlement/SpeakerIcon'

const SettlementOptionsModal = ({
  open,
  onClose,
  onEdit,
  onDelete,
  onReannounce,
}) => {
  useEffect(() => {
    if (!open) return
    const handleKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', handleKey)

    const scrollBarW = window.innerWidth - document.documentElement.clientWidth
    const originalOverflow = document.body.style.overflow
    const originalPaddingRight = document.body.style.paddingRight
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollBarW}px`

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = originalOverflow || ''
      document.body.style.paddingRight = originalPaddingRight || ''
    }
  }, [open, onClose])

  if (!open) return null

  const onBgClick = (e) => {
    if (e.target === e.currentTarget) onClose?.()
  }

  const buttonStyle =
    'border-none outline-none focus:outline-none ring-0 flex items-center gap-3 text-left text-xl font-medium text-gray-800'

  return createPortal(
    <div
      className='absolute inset-0 z-[60] flex items-end justify-center'
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onBgClick}
      role='dialog'
      aria-modal='true'
    >
      <div className='relative mr-3 box-border w-[56rem] max-w-full rounded-t-3xl bg-white px-4 pt-18 pb-15 shadow-md'>
        {/** 상단 바 */}
        <div
          className='mx-auto -mt-13 mb-8 h-2 w-40 cursor-pointer rounded bg-gray-100'
          onClick={onClose}
          aria-label='모달 닫기'
          role='button'
        />

        {/** 옵션 목록 */}
        <div className='flex flex-col gap-8'>
          <button type='button' className={buttonStyle} onClick={onEdit}>
            <PenIcon />
            정산 내역 수정하기
          </button>

          <button type='button' className={buttonStyle} onClick={onDelete}>
            <TrashIcon />
            정산 내역 삭제하기
          </button>

          <button type='button' className={buttonStyle} onClick={onReannounce}>
            <SpeakerIcon />
            정산 내역 재공지하기
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default SettlementOptionsModal
