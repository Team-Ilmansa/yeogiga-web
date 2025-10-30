import React, { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import { formatWon } from '@/hooks/settlement/formatWon'
import patchSettlementApi from '@/apis/settlement/patchSettlementApi'

const SettledList = ({ items = [] }) => {
  const { user } = useAuth()
  const { tripId, settlementId } = useParams()
  const [loadingId, setLoadingId] = useState(null)
  const tripIdNum = Number(tripId)
  const settlementIdNum = Number(settlementId)
  const currentUserId = Number(user?.userId)

  /**정산 완료 처리 API 연동 */
  const handleSettlementAction = useCallback(
    async (item) => {
      if (loadingId) return
      const payInfoId = Number(item.payInfoId ?? item.id)
      const ok = window.confirm(`${item.nickname}님의 정산을 취소하시겠습니까?`)
      if (!ok) return
      setLoadingId(payInfoId)
      try {
        await patchSettlementApi(tripIdNum, settlementIdNum, {
          payInfos: [{ payInfoId, isCompleted: false }],
        })
        alert(`${item.nickname}님의 정산이 취소되었습니다.`)
        window.location.reload()
      } catch (err) {
        console.error(err)
        alert(err?.message || '정산 취소 처리 중 오류가 발생했습니다.')
      } finally {
        setLoadingId(null)
      }
    },
    [loadingId, tripIdNum, settlementIdNum],
  )

  if (!items.length) {
    return (
      <div className='px-3 py-6 text-center text-gray-500'>
        정산 완료된 내역이 없습니다.
      </div>
    )
  }

  const Avatar = ({ url, isMe }) => (
    <div
      className={`relative h-9 w-9 overflow-hidden rounded-full bg-gray-200 ${
        isMe ? 'ring-2 ring-[var(--Blue-Scale-blue-500)]' : ''
      }`}
    >
      {url && (
        <img
          src={url}
          alt='프로필 이미지'
          className='h-full w-full object-cover'
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      )}
    </div>
  )

  return (
    <ul className='flex flex-col gap-4 px-1'>
      {items.map((p) => {
        const payInfoId = Number(p.payInfoId ?? p.id)
        const key = `pay-${payInfoId}`
        const isMe = Number(p.userId) === currentUserId
        const isLoading = loadingId === payInfoId

        return (
          <li key={key} className='flex items-center justify-between px-2'>
            <div className='flex items-center gap-3'>
              <Avatar url={p.imageUrl} isMe={isMe} />
              <div className='text-base text-gray-800'>
                {isMe && (
                  <span className='font-medium text-[var(--Blue-Scale-blue-500)]'>
                    (나){' '}
                  </span>
                )}
                {p.nickname}
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <div className='min-w-[110px] text-right text-gray-800'>
                {formatWon(p.price)}원
              </div>

              <button
                type='button'
                onClick={() => handleSettlementAction(p)}
                disabled={isLoading}
                className={`rounded-full border border-[var(--Blue-Scale-blue-200,#cfe0ff)] bg-white px-3 py-1 text-sm transition-all ${
                  isLoading
                    ? 'cursor-not-allowed opacity-60'
                    : 'text-[var(--Blue-Scale-blue-500)] hover:bg-[var(--Blue-Scale-blue-50)]'
                }`}
              >
                취소
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default SettledList
