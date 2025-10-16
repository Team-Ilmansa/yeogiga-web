import KebabIcon from '@/assets/dashboard/KebabIcon'
import GoBack from '@/assets/sign-up/GoBack'
import SettlementTitle from '@/components/settlement/SettlementTitle'
import SettleSlideTabs from '@/components/settlement/SettleSlideTabs'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SettlementOptionsModal from '@/components/dashboard/modal/SettlementOptionsModal'
import deleteSettlementApi from '@/apis/settlement/deleteSettlementApi'
import SettlementDeleteConfirmModal from '@/components/dashboard/modal/SettlementDeleteConfirmModal'

const SettlementDetail = () => {
  const navigate = useNavigate()
  const { tripId, settlementId } = useParams()

  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [settlementTitle, setSettlementTitle] = useState('정산 내역')

  const handleTitleReady = (title) => {
    if (title) setSettlementTitle(title)
  }

  const handleBack = () => navigate(-1)

  const handleEdit = () => {
    setIsOptionsOpen(false)
    // TODO: 수정 화면 이동
  }

  const handleDelete = () => {
    setIsOptionsOpen(false)
    setIsDeleteConfirmOpen(true)
  }

  const handleReannounce = () => {
    setIsOptionsOpen(false)
    // TODO: 재공지 로직
  }

  /** 정산 내역 삭제 API 호출 */
  const confirmDeleteSettlement = async () => {
    try {
      await deleteSettlementApi(tripId, settlementId)
      alert('정산 내역이 삭제되었습니다.')
      navigate(-1)
    } catch (err) {
      console.error(err)
      alert('정산 내역 삭제에 실패했습니다.')
    } finally {
      setIsDeleteConfirmOpen(false)
    }
  }

  return (
    <>
      <div className='flex w-full flex-col pt-5'>
        <div className='mb-5 flex items-center justify-between px-8'>
          <button className='border-none' onClick={handleBack}>
            <GoBack />
          </button>
          <button
            type='button'
            className='border-none bg-transparent p-1'
            onClick={() => setIsOptionsOpen(true)}
            aria-label='정산 옵션 열기'
          >
            <KebabIcon />
          </button>
        </div>
        <div className='flex w-full flex-col gap-5 px-10'>
          <SettlementTitle onTitleReady={handleTitleReady} />
          <SettleSlideTabs />
        </div>
      </div>
      <SettlementOptionsModal
        open={isOptionsOpen}
        onClose={() => setIsOptionsOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReannounce={handleReannounce}
      />
      <SettlementDeleteConfirmModal
        open={isDeleteConfirmOpen}
        title={settlementTitle}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDeleteSettlement}
      />
    </>
  )
}

export default SettlementDetail
