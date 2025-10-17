import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

const SettlementDeleteConfirmModal = ({
  open,
  title = '정산 내역',
  onCancel,
  onConfirm,
}) => {
  // ESC + 스크롤락
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onCancel?.()
    document.addEventListener('keydown', onKey)

    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original || ''
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onCancel])

  if (!open) return null

  return createPortal(
    <div className='fixed inset-0 z-[9999] flex items-center justify-center'>
      {/* 배경 */}
      <div
        className='absolute inset-0 bg-black/50'
        onClick={onCancel}
        aria-hidden='true'
      />
      {/* 카드 */}
      <div
        className='relative z-10 w-[380px] rounded-2xl bg-white p-6 shadow-xl'
        role='dialog'
        aria-modal='true'
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className='mb-2 text-lg font-bold text-gray-900'>
          “{title}” 내역을 정말로 삭제하시겠어요?
        </h2>
        <p className='mb-10 text-sm text-gray-500'>
          해당 작업은 복구할 수 없어요
        </p>

        <div className='flex gap-2'>
          <button
            className='flex-1 rounded-lg border-none bg-gray-100 py-3 font-semibold text-gray-700'
            onClick={onCancel}
          >
            취소
          </button>
          <button
            className='flex-1 rounded-lg border-none bg-gray-100 py-3 font-semibold text-red-500'
            onClick={onConfirm}
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default SettlementDeleteConfirmModal
