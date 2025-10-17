import { useEffect } from 'react'
import { createPortal } from 'react-dom'

/** 공통 버튼 스타일 */
const ButtonStyle = {
  base: 'h-15 rounded-2xl border-none text-lg outline-none transition-colors',
  cancel: 'bg-gray-100 text-gray-700',
  confirm: 'text-white bg-[var(--Blue-Scale-blue-500)]',
  disabledConfirm: 'text-white bg-gray-400 cursor-not-allowed',
}

/** 정산 내역 수정 확인 모달*/
const SettlementEditModal = ({
  open,
  onClose,
  onConfirm,
  isSubmitting = false,
}) => {
  // ESC 닫기 + 스크롤 잠금
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)

    const scrollBarW = window.innerWidth - document.documentElement.clientWidth
    const originalOverflow = document.body.style.overflow
    const originalPaddingRight = document.body.style.paddingRight
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollBarW}px`

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = originalOverflow || ''
      document.body.style.paddingRight = originalPaddingRight || ''
    }
  }, [open, onClose])

  if (!open) return null

  const onBgClick = (e) => {
    if (e.target === e.currentTarget) onClose?.()
  }

  const confirmBtnClass = [
    ButtonStyle.base,
    isSubmitting ? ButtonStyle.disabledConfirm : ButtonStyle.confirm,
  ].join(' ')

  const cancelBtnClass = [ButtonStyle.base, ButtonStyle.cancel].join(' ')

  return createPortal(
    <div
      className='fixed inset-0 z-[70] flex items-center justify-center'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onBgClick}
      role='dialog'
      aria-modal='true'
    >
      <div className='flex h-[230px] w-[450px] max-w-[90%] flex-col justify-between rounded-2xl bg-white p-8 shadow-lg'>
        <div>
          <div className='mb-2 text-2xl font-semibold text-gray-900'>
            정산 내역 수정하기
          </div>
          <div className='text-base text-gray-600'>
            정산 내역을 이대로 수정하시겠어요?
          </div>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <button
            type='button'
            onClick={onClose}
            className={cancelBtnClass}
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            type='button'
            onClick={onConfirm}
            disabled={isSubmitting}
            className={confirmBtnClass}
          >
            {isSubmitting ? '수정 중…' : '수정하기'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default SettlementEditModal
