import PlaceIcon from '@/assets/dashboard/PlaceIcon'
import { Archive } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import useAuth from '@/hooks/useAuth'
import readNoticeApi from '@/apis/notice/readNoticeApi'
import { useNavigate, useParams } from 'react-router-dom'
import readSpecificNoticeApi from '@/apis/notice/readSpecificNoticeApi'
import readPinApi from '@/apis/pin/readPinApi'
import KebabIcon from '@/assets/dashboard/KebabIcon'
import deletePinApi from '@/apis/pin/deletePinApi'
import { createPortal } from 'react-dom'
import ArrowUp from '@/assets/dashboard/ArrowUp'
import ArrowDown from '@/assets/dashboard/ArrowDown'
import NoticeOptionsModal from '../dashboard/modal/NoticeOptionModal'
import NoticeCreateModal from '../dashboard/modal/NoticeCreateModal'
import deleteNoticeApi from '@/apis/notice/deleteNoticeApi'
import NoticeViewModal from '../dashboard/modal/NoticeViewModal'

const Notices = () => {
  const { user } = useAuth()
  const { tripId, day } = useParams()
  const navigate = useNavigate()

  const [notices, setNotices] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedNotice, setSelectedNotice] = useState(null)

  const [pinData, setPinData] = useState(null)
  const [hasPin, setHasPin] = useState(true)

  const [isPinDeleteModalOpen, setIsPinDeleteModalOpen] = useState(false)
  const [isCurrentOpen, setIsCurrentOpen] = useState(false)
  const [isNoticeOptionsModalOpen, setIsNoticeOptionsModalOpen] =
    useState(false)
  const [selectedNoticeForOptions, setSelectedNoticeForOptions] = useState(null)
  const [isNoticeDeleteModalOpen, setIsNoticeDeleteModalOpen] = useState(false)

  useEffect(() => {
    const open =
      isModalOpen ||
      isPinDeleteModalOpen ||
      isNoticeOptionsModalOpen ||
      isNoticeDeleteModalOpen
    const original = document.body.style.overflow
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = original || ''
    return () => {
      document.body.style.overflow = original || ''
    }
  }, [
    isModalOpen,
    isPinDeleteModalOpen,
    isNoticeOptionsModalOpen,
    isNoticeDeleteModalOpen,
  ])

  /** 전체 공지사항 조회 */
  const fetchNotices = useCallback(async () => {
    try {
      const result = await readNoticeApi(tripId)
      setNotices(result.data.content)
    } catch (err) {
      console.error(err)
    }
  }, [tripId])

  useEffect(() => {
    if (user && tripId) {
      fetchNotices()
    }
  }, [user, tripId, fetchNotices])

  /** 특정 공지사항 조회 (상세 모달) */
  const fetchSpecificNotice = async (id) => {
    try {
      const result = await readSpecificNoticeApi(tripId, id)
      setSelectedNotice(result.data)
      setIsModalOpen(true)
    } catch (err) {
      console.error(err)
    }
  }

  /** 집결지 핀 조회 */
  useEffect(() => {
    if (!tripId) return
    const fetchPin = async () => {
      try {
        const result = await readPinApi(tripId)
        if (result?.data?.place) {
          setPinData(result.data)
          setHasPin(true)
        } else {
          setHasPin(false)
        }
      } catch (err) {
        console.error('집결지 조회 실패:', err)
        setHasPin(false)
      }
    }
    fetchPin()
  }, [tripId])

  /** 집결지 핀 삭제 */
  const handleDeletePin = async () => {
    try {
      await deletePinApi(tripId)
      alert('집결지가 삭제되었습니다.')
      setPinData(null)
      setHasPin(false)
    } catch (err) {
      console.error('집결지 삭제 실패:', err)
      alert('집결지 삭제에 실패했습니다.')
    } finally {
      setIsPinDeleteModalOpen(false)
    }
  }

  /** 공지 옵션 모달 열기 */
  const handleNoticeKebabClick = (e, notice) => {
    e.stopPropagation()
    setSelectedNoticeForOptions(notice)
    setIsNoticeOptionsModalOpen(true)
  }

  /** 공지 완료 처리 */
  const handleCompleteNotice = () => {
    if (!selectedNoticeForOptions) return
    alert(`'${selectedNoticeForOptions.title}' 공지를 완료 처리합니다.`)
    setIsNoticeOptionsModalOpen(false)
  }

  /** 공지 삭제 처리 */
  const handleDeleteNotice = () => {
    if (!selectedNoticeForOptions) return
    setIsNoticeOptionsModalOpen(false)
    setIsNoticeDeleteModalOpen(true)
  }

  /** 실제 삭제 실행 */
  const confirmDeleteNotice = async () => {
    if (!selectedNoticeForOptions) return
    const { id } = selectedNoticeForOptions
    try {
      await deleteNoticeApi(tripId, id)
      setNotices((prev) => prev.filter((n) => n.id !== id))
      alert('공지가 삭제되었습니다.')
    } catch (err) {
      console.error(err)
      alert('공지 삭제에 실패했습니다.')
    } finally {
      setIsNoticeDeleteModalOpen(false)
      setSelectedNoticeForOptions(null)
    }
  }

  const containerStyle =
    'flex items-center justify-between gap-3 rounded-2xl bg-[var(--Blue-Scale-blue-100)] px-4 h-[70px]'
  const fontStyle = 'text-base font-medium text-gray-700'

  return (
    <div className='space-y-2'>
      {/* 특정 공지 상세 모달 */}
      <NoticeViewModal
        open={isModalOpen}
        notice={selectedNotice}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedNotice(null)
        }}
      />

      {/* 집결지 삭제 모달 */}
      {isPinDeleteModalOpen &&
        createPortal(
          <div className='fixed inset-0 z-[9999] flex items-center justify-center'>
            <div
              className='absolute inset-0 bg-black/50'
              onClick={() => setIsPinDeleteModalOpen(false)}
              aria-hidden='true'
            />
            <div
              className='relative z-10 w-[350px] rounded-2xl bg-white p-6 shadow-xl'
              role='dialog'
              aria-modal='true'
            >
              <h2 className='mb-2 text-lg font-bold text-gray-800'>
                집결지를 정말로 삭제하시겠어요?
              </h2>
              <p className='mb-10 text-sm text-gray-500'>
                해당 작업은 복구할 수 없어요
              </p>
              <div className='flex gap-2'>
                <button
                  className='flex-1 rounded-lg border-none bg-gray-100 py-3 font-semibold text-gray-700'
                  onClick={() => setIsPinDeleteModalOpen(false)}
                >
                  취소
                </button>
                <button
                  className='flex-1 rounded-lg border-none bg-gray-100 py-3 font-semibold text-red-500'
                  onClick={handleDeletePin}
                >
                  삭제하기
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
      {/** 공지 삭제 확인 모달 */}
      {isNoticeDeleteModalOpen &&
        createPortal(
          <div className='fixed inset-0 z-[9999] flex items-center justify-center'>
            <div
              className='absolute inset-0 bg-black/50'
              onClick={() => setIsNoticeDeleteModalOpen(false)}
              aria-hidden='true'
            />
            <div
              className='relative z-10 w-[380px] rounded-2xl bg-white p-6 shadow-xl'
              role='dialog'
              aria-modal='true'
            >
              <h2 className='mb-2 text-lg font-bold text-gray-800'>
                "{selectedNoticeForOptions?.title || '공지'}" 공지를 정말로
                삭제하시겠어요?
              </h2>
              <p className='mb-10 text-sm text-gray-500'>
                해당 작업은 복구할 수 없어요
              </p>
              <div className='flex gap-2'>
                <button
                  className='flex-1 rounded-lg border-none bg-gray-100 py-3 font-semibold text-gray-700'
                  onClick={() => setIsNoticeDeleteModalOpen(false)}
                >
                  취소
                </button>
                <button
                  className='flex-1 rounded-lg border-none bg-gray-100 py-3 font-semibold text-red-500'
                  onClick={confirmDeleteNotice}
                >
                  삭제하기
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
      {/* 공지 옵션 모달 */}
      <NoticeOptionsModal
        isOpen={isNoticeOptionsModalOpen}
        onClose={() => setIsNoticeOptionsModalOpen(false)}
        onComplete={handleCompleteNotice}
        onDelete={handleDeleteNotice}
      />
      {/* 헤더 */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <h1 className='flex items-center gap-1 text-3xl leading-normal font-bold'>
            현재 공지
            <button
              onClick={() => setIsCurrentOpen((prev) => !prev)}
              className='ml-1 flex items-center border-none bg-transparent p-1 transition-transform hover:scale-110'
              aria-expanded={isCurrentOpen}
              aria-controls='current-notice-section'
              title={isCurrentOpen ? '공지 접기' : '공지 펼치기'}
            >
              {isCurrentOpen ? <ArrowUp /> : <ArrowDown />}
            </button>
          </h1>
        </div>

        <button
          onClick={() => navigate(`/trip/${tripId}/past/notices`)}
          className='mt-1 flex items-center border-none text-base text-gray-400 hover:text-gray-500'
        >
          지난 공지 전체보기
        </button>
      </div>
      {/* 본문 */}
      {isCurrentOpen && (
        <div id='current-notice-section' className='space-y-3'>
          {/* 집결지 카드 */}
          {hasPin && pinData && (
            <div
              className={containerStyle + ' cursor-pointer'}
              onClick={() =>
                navigate(
                  `/trip/${tripId}/map/${day}?lat=${pinData.latitude}&lng=${pinData.longitude}`,
                )
              }
            >
              <div className='flex flex-1 items-center gap-3 overflow-hidden'>
                <PlaceIcon className='h-6 w-6 flex-shrink-0' />
                <div className='flex min-w-0 items-baseline gap-2'>
                  <span className={`${fontStyle} truncate`}>
                    {pinData.place}
                  </span>
                  <span className='truncate text-sm text-indigo-300'>
                    {pinData.time
                      ? new Date(pinData.time).toLocaleString('ko-KR')
                      : ''}
                  </span>
                </div>
              </div>
              <button
                className='border-none bg-transparent p-2'
                onClick={(e) => {
                  e.stopPropagation()
                  setIsPinDeleteModalOpen(true)
                }}
              >
                <KebabIcon />
              </button>
            </div>
          )}

          {/* 공지 리스트 */}
          {notices.length === 0 ? (
            <div className={containerStyle}>
              <div className='flex items-center gap-3'>
                <Archive className='h-6 w-6 text-[var(--Blue-Scale-blue-500)]' />
                <div className={fontStyle}>현재 공지사항 없음</div>
              </div>
            </div>
          ) : (
            notices.map((notice) => (
              <div
                key={notice.id}
                className={containerStyle + ' cursor-pointer'}
                onClick={() => fetchSpecificNotice(notice.id)}
              >
                <div className='flex flex-1 items-center gap-3 overflow-hidden'>
                  <Archive className='h-6 w-6 flex-shrink-0 text-[var(--Blue-Scale-blue-500)]' />
                  <span className={`${fontStyle} truncate`}>
                    {notice.title || '제목 없음'}
                  </span>
                </div>
                <button
                  className='border-none bg-transparent p-2'
                  onClick={(e) => handleNoticeKebabClick(e, notice)}
                >
                  <KebabIcon />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Notices
