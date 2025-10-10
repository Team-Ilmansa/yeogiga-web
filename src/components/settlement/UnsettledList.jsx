import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { formatWon } from '@/hooks/settlement/formatWon'

const UnsettledList = ({ items = [], onContentUpdate, currentUserId }) => {
  const params = useParams()
  const inferredCurrentUserId = useMemo(() => {
    const uid = params.userId ? Number(params.userId) : undefined
    return Number.isFinite(uid) ? uid : undefined
  }, [params.userId])

  const me = currentUserId ?? inferredCurrentUserId

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
        const isMe = me != null && p.userId === me
        return (
          <li key={key} className='flex items-center justify-between px-2'>
            <div className='flex items-center gap-3'>
              <Avatar url={p.imageUrl} isMe={isMe} />
              <div className='text-base text-gray-800'>
                {isMe ? '(나) ' : ''}
                {p.nickname}
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <div className='min-w-[110px] text-right text-gray-800'>
                {formatWon(p.price)}원
              </div>
              {/* TODO: 완료버튼 함수 연겵 */}
              <button
                type='button'
                className='border-[var(--Blue-Scale-blue-200, #cfe0ff)] rounded-full border bg-white px-3 py-1 text-sm text-[var(--Blue-Scale-blue-500)]'
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
