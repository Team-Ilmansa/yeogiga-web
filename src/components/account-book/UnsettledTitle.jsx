import readTotalSettlementsApi from '@/apis/settlement/readTotalSettlementsApi'
import { useEffect, useState } from 'react'
import { set } from 'react-hook-form'
import { useParams } from 'react-router-dom'

/**미정산 내역을 알리는 타이틀 컴포넌트 */
const UnsettledTitle = () => {
  const { tripId } = useParams()
  const [count, setCount] = useState(null)

  const fetchUnSettledCount = async () => {
    try {
      setCount(null)
      const result = await readTotalSettlementsApi(tripId)
      console(result)

      const dateTotalGroups = result.data

      const dateTotalItems = Object.values(dateTotalGroups).flat()
      const unsettled = dateTotalItems.filter(
        (dataItem) => dataItem.isCompleted === false,
      )

      setCount(unsettled.length)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (tripId) {
      fetchUnSettledCount()
    }
  }, [tripId])

  // TODO: 미정산 내역 수 API 연결
  return (
    <div className='text-[28pt] font-bold'>
      {count}건의
      <br />
      미정산 내역이 있어요
    </div>
  )
}

export default UnsettledTitle
