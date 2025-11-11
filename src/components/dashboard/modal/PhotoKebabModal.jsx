import React, { useEffect } from 'react'
import { Download, Trash2, Share2 } from 'lucide-react'

const PhotoKebabModal = ({
  onClose,
  onDelete,
  onDownload,
  onShare,
}) => {
  useEffect(() => {
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollBarWidth}px`

    return () => {
      document.body.style.overflow = 'auto'
      document.body.style.paddingRight = '0px'
    }
  }, [])

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const buttonStyle =
    'border-none outline-none focus:outline-none ring-0 flex items-center gap-3 text-left text-base font-medium text-gray-800 w-full'

  return (
    <div
      className='absolute inset-0 z-[110] flex items-end justify-center'
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleBackgroundClick}
    >
      <div className='mr-3 box-border w-[56rem] max-w-full rounded-t-2xl bg-white px-4 py-5 shadow-md'>
        <div
          className='mx-auto mb-6 h-1.5 w-40 cursor-pointer rounded bg-gray-100'
          onClick={onClose}
        />
        <div className='flex flex-col gap-4'>
          <button onClick={onDelete} className={buttonStyle}>
            <Trash2 className='h-5 w-5' />
            삭제
          </button>
          <button onClick={onShare} className={buttonStyle}>
            <Share2 className='h-5 w-5' />
            공유하기
          </button>
          <button onClick={onDownload} className={buttonStyle}>
            <Download className='h-5 w-5' />
            내 PC에 다운로드
          </button>
        </div>
      </div>
    </div>
  )
}

export default PhotoKebabModal
