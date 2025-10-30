import React, { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import { formatWon } from '@/hooks/settlement/formatWon'
import patchSettlementApi from '@/apis/settlement/patchSettlementApi'

const UnsettledList = ({ items = [], currentUserId }) => {
  const { user } = useAuth()
  const { tripId, settlementId, userId: routeUserId } = useParams()
  const [loadingId, setLoadingId] = useState(null)

  const tripIdNum = Number(tripId)
  const settlementIdNum = Number(settlementId)

  /** 현재 로그인 사용자 식별 */
  const me =
    Number(currentUserId) ||
    Number(user?.userId) ||
    Number(routeUserId) ||
    undefined

  /**정산 완료 처리 API 연동 */
  const handleSettlementAction = useCallback(
    async (item) => {
      if (loadingId) return

      const payInfoId = Number(item.payInfoId ?? item.id)
      if (!payInfoId) {
        alert('유효하지 않은 결제 항목입니다.')
        return
      }

      const ok = window.confirm(
        `${item.nickname}님의 정산을 완료 처리하시겠습니까?`,
      )
      if (!ok) return

      setLoadingId(payInfoId)

      try {
        await patchSettlementApi(tripIdNum, settlementIdNum, {
          payInfos: [{ payInfoId, isCompleted: true }],
        })
        alert(`${item.nickname}님의 정산이 완료 처리되었습니다.`)
        window.location.reload()
      } catch (err) {
        console.error(err)
        alert(err?.message || '정산 완료 처리 중 오류가 발생했습니다.')
      } finally {
        setLoadingId(null)
      }
    },
    [tripIdNum, settlementIdNum, loadingId],
  )

  const Avatar = ({ url, isMe }) => (
    <div
      className={`relative h-9 w-9 overflow-hidden rounded-full bg-gray-200 ${
        isMe ? 'ring-2 ring-[var(--Blue-Scale-blue-500)]' : ''
      }`}
      title={isMe ? '나' : undefined}
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

  if (!items.length)
    return (
      <div className='px-3 py-6 text-center text-gray-500'>
        미정산 내역이 없습니다.
      </div>
    )

  return (
    <ul className='flex flex-col gap-4 px-1'>
      {items.map((p) => {
        const payInfoId = Number(p.payInfoId ?? p.id)
        const key = `pay-${payInfoId}`
        const isMe = Number(p.userId) === me
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
