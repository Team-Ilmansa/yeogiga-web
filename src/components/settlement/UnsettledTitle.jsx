import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import readTotalSettlementsApi from '@/apis/settlement/readTotalSettlementsApi'

/** 미정산 내역을 알리는 타이틀 컴포넌트 */
const UnsettledTitle = () => {
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

        const unsettledItems = allItems.filter(
          (item) => item && item.isCompleted === false,
        )

        setCount(unsettledItems.length)
      } catch (err) {
        console.error(err)
        setCount(0)
      }
    }

    fetchUnSettledCount()
  }, [tripId])

  return (
    <div className='text-[28pt] font-bold'>
      {count !== null ? (
        <>
          {count}건의
          <br />
          미정산 내역이 있어요
        </>
      ) : (
        '불러오는 중...'
      )}
    </div>
  )
}

export default UnsettledTitle
