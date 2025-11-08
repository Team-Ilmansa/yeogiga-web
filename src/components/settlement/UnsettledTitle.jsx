import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import readTotalSettlementsApi from '@/apis/settlement/readTotalSettlementsApi'

/** 미정산 내역을 알리는 타이틀 컴포넌트 */
const UnsettledTitle = ({
  showMineOnly = false,
  onToggleShowMine,
  myUserId,
}) => {
  const { tripId } = useParams()
  const [count, setCount] = useState(null)

  useEffect(() => {
    const fetchUnSettledCount = async () => {
      try {
        if (!tripId) return
        const result = await readTotalSettlementsApi(tripId)
        const groups = result?.data ?? {}

        const allItems = Object.values(groups).flatMap((arr) =>
          Array.isArray(arr) ? arr : [],
        )

        let unsettledItems = allItems.filter(
          (item) => item && item.isCompleted === false,
        )

        if (showMineOnly && myUserId) {
          unsettledItems = unsettledItems.filter((item) => {
            const creatorId = item.payerId

            const payers = Array.isArray(item?.payers) ? item.payers : []
            const participants = Array.isArray(item?.participants)
              ? item.participants
              : []

            const inCreator = creatorId === myUserId
            const inPayers = payers.some((p) => (p.userId ?? p.id) === myUserId)
            const inParticipants = participants.some((uid) => uid === myUserId)

            return inCreator || inPayers || inParticipants
          })
        }

        setCount(unsettledItems.length)
      } catch (err) {
        console.error(err)
        setCount(0)
      }
    }

    fetchUnSettledCount()
  }, [tripId, showMineOnly, myUserId])

  return (
    <div className='flex items-end justify-between'>
      <h1 className='flex flex-col text-3xl leading-tight font-bold'>
        {count !== null ? (
          <>
            <span>{count}건의</span>
            <span>미정산 내역이 있어요</span>
          </>
        ) : (
          '불러오는 중...'
        )}
      </h1>

      {/** 토글 버튼 */}
      <button
        type='button'
        onClick={onToggleShowMine}
        className='w-[116px] cursor-pointer border-none bg-transparent text-right text-base text-gray-400 hover:text-gray-500'
        aria-pressed={showMineOnly}
      >
        {showMineOnly ? '전체 정산 보기' : '내 정산만 보기'}
      </button>
    </div>
  )
}

export default UnsettledTitle
