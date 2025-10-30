import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import readSettlementApi from '@/apis/settlement/readSettlementApi'
import CalendarIcon from '@/assets/dashboard/CalendarIcon'
import UserIcon from '@/assets/dashboard/UserIcon'
import { formatWon } from '@/hooks/settlement/formatWon'

import SelTouristIcon from '@/assets/map/category/SelTouristIcon'
import SelTransportIcon from '@/assets/map/category/SelTransportIcon'
import SelMealIcon from '@/assets/map/category/SelMealIcon'
import SelLodgingIcon from '@/assets/map/category/SelLodgingIcon'
import SelEtcIcon from '@/assets/map/category/SelEtcIcon'

const formatDate = (date) =>
  new Date(date).toLocaleDateString('ko-KR').replace(/\.\s/g, '. ').slice(0, -1)

const typeToIcon = (type) => {
  switch (type) {
    case 'TOURISM':
      return SelTouristIcon
    case 'TRANSPORT':
      return SelTransportIcon
    case 'RESTAURANT':
      return SelMealIcon
    case 'LODGING':
      return SelLodgingIcon
    case 'ETC':
    default:
      return SelEtcIcon
  }
}
const typeToLabel = (type) => {
  switch (type) {
    case 'TOURISM':
      return '관광지'
    case 'TRANSPORT':
      return '이동수단'
    case 'RESTAURANT':
      return '식사'
    case 'LODGING':
      return '숙박'
    case 'ETC':
    default:
      return '기타'
  }
}

const Avatar = ({ url, name }) =>
  url ? (
    <img
      src={url}
      alt={name || 'payer'}
      className='h-[20px] w-[20px] rounded-full object-cover'
    />
  ) : (
    <div className='h-[20px] w-[20px] rounded-full bg-gray-300' />
  )

const SettlementTitle = ({ onTitleReady }) => {
  const { tripId, settlementId } = useParams()
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const result = await readSettlementApi(tripId, settlementId)
        setData(result.data)
      } catch (err) {
        alert(err.message)
      }
    }
    if (tripId && settlementId) fetchDetail()
  }, [tripId, settlementId])

  useEffect(() => {
    if (data?.name && typeof onTitleReady === 'function')
      onTitleReady(data.name)
  }, [data, onTitleReady])

  const allCompleted = useMemo(() => {
    if (!data) return false
    if (Array.isArray(data.payInfos) && data.payInfos.length > 0) {
      return data.payInfos.every((pi) => pi?.isCompleted === true)
    }
    if (Array.isArray(data.payers) && data.payers.length > 0) {
      return data.payers.every(
        (p) => p?.isCompleted === true || p?.completed === true,
      )
    }
    return Boolean(data.isCompleted)
  }, [data])

  const statusText = useMemo(
    () => (allCompleted ? '정산이 완료됐어요' : '정산이 진행중이에요'),
    [allCompleted],
  )

  if (!data) return <p>정산 정보를 불러오는 중...</p>

  const TypeIcon = typeToIcon(data.type)

  return (
    <div>
      <div>
        <div
          className='text-[14pt]'
          style={{ color: 'var(--Blue-Scale-blue-500)' }}
        >
          {statusText}
        </div>

        <div
          className={`text-[30pt] font-bold transition-opacity ${
            allCompleted ? 'text-gray-400 opacity-80' : 'text-black opacity-100'
          }`}
        >
          {data.name}
        </div>

        <div
          className={`text-[30pt] font-bold transition-opacity ${
            allCompleted ? 'text-gray-400 opacity-80' : 'text-black opacity-100'
          }`}
        >
          {formatWon(data.totalPrice)}원
        </div>
      </div>

      <div className='mt-4 flex flex-col gap-y-1 text-[14pt] text-gray-700'>
        <div className='flex items-center gap-2'>
          <TypeIcon className='h-5 w-5' />
          <span>{typeToLabel(data.type)}</span>
        </div>

        <div className='flex items-center gap-2'>
          <CalendarIcon className='h-5 w-5' />
          <span>{data.date ? formatDate(data.date) : '???'}</span>
        </div>

        <div className='flex items-center gap-2'>
          <UserIcon className='h-5 w-5' />
          <ul className='flex gap-1'>
            {(Array.isArray(data.payers) ? data.payers : []).map((payer) => (
              <li key={payer.id ?? payer.userId}>
                <Avatar url={payer.imageUrl} name={payer.nickname} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SettlementTitle
