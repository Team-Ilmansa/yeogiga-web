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
        const result = await readTotalSettlementsApi(tripId)
        console.log('전체 정산 내역:', result)

        /** 날짜별 그룹 객체 -> 배열 합치기*/
        const allItems = Object.values(result).flat()

        /** 미정산 내역만 필터링*/
        const unsettledItems = allItems.filter((item) => !item.isCompleted)

        /** 미정산 개수 저장*/
        setCount(unsettledItems.length)
      } catch (err) {
        console.error(err)
        setCount(0)
      }
    }

    if (tripId) {
      fetchUnSettledCount()
    }
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
