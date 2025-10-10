import React, { useEffect } from 'react'
import { formatWon } from '@/hooks/settlement/formatWon'
import useAuth from '@/hooks/useAuth'

const UnsettledList = ({ items = [], onContentUpdate }) => {
  const { user } = useAuth()
  const currentUserId = user?.userId

  useEffect(() => {
    const t = setTimeout(() => onContentUpdate?.(), 0)
    return () => clearTimeout(t)
  }, [items, onContentUpdate])

  const Avatar = ({ url, isMe }) => (
    <div
      className={`relative h-9 w-9 overflow-hidden rounded-full bg-gray-200 ${
        isMe ? 'ring-2 ring-[var(--Blue-Scale-blue-500)]' : 'ring-0'
      }`}
    >
      {url ? (
        <img
          src={url}
          alt='프로필 이미지'
          className='h-full w-full object-cover'
          onLoad={() => onContentUpdate?.()}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            onContentUpdate?.()
          }}
        />
      ) : null}
    </div>
  )

  if (!items.length) {
    return (
      <div className='px-3 py-6 text-center text-gray-500'>
        미정산 내역이 없습니다.
      </div>
    )
  }

  return (
    <ul className='flex flex-col gap-4 px-1'>
      {items.map((p) => {
        const key = p.id ?? p.userId
        const isMe = Number(p.userId) === Number(currentUserId)

        return (
          <li key={key} className='flex items-center justify-between px-2'>
            <div className='flex items-center gap-3'>
              <Avatar url={p.imageUrl} isMe={isMe} />
              <div className='text-base text-gray-800'>
                {isMe ? (
                  <span className='font-medium text-[var(--Blue-Scale-blue-500)]'>
                    (나){' '}
                  </span>
                ) : null}
                {p.nickname}
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <div className='min-w-[110px] text-right text-gray-800'>
                {formatWon(p.price)}원
              </div>

              <button
                type='button'
                className='rounded-full border border-[var(--Blue-Scale-blue-200,#cfe0ff)] bg-white px-3 py-1 text-sm text-[var(--Blue-Scale-blue-500)]'
              >
                완료
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default UnsettledList
