import readNoticeApi from '@/apis/notice/readNoticeApi'
import readSpecificNoticeApi from '@/apis/notice/readSpecificNoticeApi'
import deleteNoticeApi from '@/apis/notice/deleteNoticeApi'
import patchNoticeApi from '@/apis/notice/patchNoticeApi'
import React, { useEffect, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useParams } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import readTripInfoApi from '@/apis/trip/readTripInfo'
import GoBack from '@/assets/sign-up/GoBack'
import KebabIcon from '@/assets/dashboard/KebabIcon'
import NoticeViewModal from '../dashboard/modal/NoticeViewModal'
import NoticeOptionsModal from '../dashboard/modal/NoticeOptionModal'
import updateNoticeApi from '@/apis/notice/updateNoticeApi'

const PastNotices = () => {
  const { user } = useAuth()
  const { tripId } = useParams()
  const navigate = useNavigate()

  const [notices, setNotices] = useState([])
  const [tripTitle, setTripTitle] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedNotice, setSelectedNotice] = useState(null)

  /** 옵션/확인 모달 관련 상태 */
  const [isNoticeOptionsModalOpen, setIsNoticeOptionsModalOpen] =
    useState(false)
  const [selectedNoticeForOptions, setSelectedNoticeForOptions] = useState(null)
  const [isNoticeDeleteModalOpen, setIsNoticeDeleteModalOpen] = useState(false)
  const [isNoticeCompleteModalOpen, setIsNoticeCompleteModalOpen] =
    useState(false)

  const [isNoticeEditModalOpen, setIsNoticeEditModalOpen] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editError, setEditError] = useState('')

  /** 전체 공지사항 불러오기 */
  useEffect(() => {
    if (!user || !tripId) return

    const fetchNotice = async () => {
      try {
        const result = await readNoticeApi(tripId)
        setNotices(result.data.content ?? [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchNotice()
  }, [user, tripId])

  /** 여행 제목 불러오기 */
  useEffect(() => {
    if (!user || !tripId) return
    const fetchTripInfo = async () => {
      try {
        const result = await readTripInfoApi(tripId)
        setTripTitle(result.data.title)
      } catch (err) {
        console.error(err)
      }
    }
    fetchTripInfo()
  }, [user, tripId])

  /** 공지 분류 (completed 여부로 분리) */
  const { currentNotices, pastNotices } = useMemo(() => {
    const current = notices.filter((n) => n.completed === false)
    const past = notices.filter((n) => n.completed === true)
    return { currentNotices: current, pastNotices: past }
  }, [notices])

  /** 공지 상세 조회 */
  const fetchSpecificNotice = async (noticeId) => {
    try {
      const result = await readSpecificNoticeApi(tripId, noticeId)
      setSelectedNotice(result.data)
      setIsModalOpen(true)
    } catch (err) {
      console.error('공지 상세 조회 실패:', err)
    }
  }

  /** 공지 수정 모달 */
  const handleEditNotice = () => {
    if (!selectedNoticeForOptions) return
    setEditTitle(selectedNoticeForOptions.title || '')
    setEditDescription(selectedNoticeForOptions.description || '')
    setIsNoticeOptionsModalOpen(false)
    setIsNoticeEditModalOpen(true)
  }

  /** 케밥 클릭 시 옵션 모달 열기 */
  const handleKebabClick = (e, notice) => {
    e.stopPropagation()
    setSelectedNoticeForOptions(notice)
    setIsNoticeOptionsModalOpen(true)
  }

  /** 공지 완료 클릭 → 확인 모달 */
  const handleCompleteNotice = () => {
    setIsNoticeOptionsModalOpen(false)
    setIsNoticeCompleteModalOpen(true)
  }

  /** 공지 삭제 클릭 → 확인 모달 */
  const handleDeleteNotice = () => {
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

  /** 실제 완료 실행 */
  const confirmCompleteNotice = async () => {
    if (!selectedNoticeForOptions) return

    if (selectedNoticeForOptions.completed) {
      alert('이미 완료된 공지입니다.')
      setIsNoticeCompleteModalOpen(false)
      setSelectedNoticeForOptions(null)
      return
    }

    const { id } = selectedNoticeForOptions
    try {
      await patchNoticeApi(tripId, id)
      setNotices((prev) => prev.filter((n) => n.id !== id))
      alert('공지가 완료 처리되었습니다.')
    } catch (err) {
      console.error(err)
      alert('공지 완료 처리에 실패했습니다.')
    } finally {
      setIsNoticeCompleteModalOpen(false)
      setSelectedNoticeForOptions(null)
    }
  }

  /** 실제 수정 실행 */
  const confirmEditNotice = async () => {
    if (!selectedNoticeForOptions) return
    const { id } = selectedNoticeForOptions
    const title = (editTitle ?? '').trim()
    const description = (editDescription ?? '').trim()

    // 프론트에서 선제 유효성 검사
    if (!description) {
      setEditError('내용은 필수 입력값입니다.')
      return
    }
    try {
      await updateNoticeApi(tripId, id, { title, description })
      setNotices((prev) =>
        prev.map((n) => (n.id === id ? { ...n, title, description } : n)),
      )
      alert('공지 수정이 완료되었습니다.')
    } catch (err) {
      console.error(err)
      alert('공지 수정에 실패했습니다.')
    } finally {
      setIsNoticeEditModalOpen(false)
      setSelectedNoticeForOptions(null)
    }
  }

  const titleStyle = 'text-lg font-bold text-gray-700 mb-2'
  const cardBase =
    'flex items-center justify-between gap-3 rounded-2xl px-4 h-[70px] shadow-sm transition-colors cursor-pointer'

  return (
    <div className='flex w-full flex-col pt-5'>
      {/* 뒤로가기 */}
      <div className='mb-5 flex items-center justify-between px-8'>
        <button
          className='border-none p-0'
          onClick={() => navigate(`/trip/${tripId}`)}
        >
          <GoBack />
        </button>
      </div>

      {/* 공지 상세 모달 */}
      <NoticeViewModal
        open={isModalOpen}
        notice={selectedNotice}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedNotice(null)
        }}
      />

      {/* 공지 옵션 모달 */}
      <NoticeOptionsModal
        isOpen={isNoticeOptionsModalOpen}
        onClose={() => setIsNoticeOptionsModalOpen(false)}
        onComplete={handleCompleteNotice}
        onDelete={handleDeleteNotice}
        onEdit={handleEditNotice}
      />

      {/* 공지 삭제 확인 모달 */}
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
                해당 작업은 복구할 수 없어요.
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

      {/** 공지 수정 모달 */}
      {isNoticeEditModalOpen &&
        createPortal(
          <div className='fixed inset-0 z-[9999] flex items-center justify-center'>
            <div
              className='absolute inset-0 bg-black/50'
              onClick={() => setIsNoticeEditModalOpen(false)}
              aria-hidden='true'
            />
            <div
              className='relative z-10 w-[420px] rounded-2xl bg-white p-6 shadow-xl'
              role='dialog'
              aria-modal='true'
            >
              <h2 className='mb-2 text-lg font-bold text-gray-800'>
                공지사항 수정하기
              </h2>
              <div className='mt-5 flex flex-col gap-3'>
                <input
                  type='text'
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className='w-full rounded-lg border border-gray-300 p-2 text-base text-gray-800'
                  placeholder='제목을 입력하세요'
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => {
                    setEditDescription(e.target.value)
                    if (editError) setEditError('')
                  }}
                  className='h-32 w-full resize-none rounded-lg border border-gray-300 p-2 text-base text-gray-800'
                  placeholder='내용을 입력하세요'
                />
              </div>

              <div className='mt-6 flex gap-2'>
                <button
                  className='flex-1 rounded-lg border-none bg-gray-100 py-3 font-semibold text-gray-700'
                  onClick={() => setIsNoticeEditModalOpen(false)}
                >
                  취소
                </button>
                <button
                  className='flex-1 rounded-lg border-none bg-gray-100 py-3 font-semibold text-blue-600'
                  onClick={confirmEditNotice}
                >
                  수정하기
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* 공지 완료 확인 모달 */}
      {isNoticeCompleteModalOpen &&
        createPortal(
          <div className='fixed inset-0 z-[9999] flex items-center justify-center'>
            <div
              className='absolute inset-0 bg-black/50'
              onClick={() => setIsNoticeCompleteModalOpen(false)}
              aria-hidden='true'
            />
            <div
              className='relative z-10 w-[380px] rounded-2xl bg-white p-6 shadow-xl'
              role='dialog'
              aria-modal='true'
            >
              <h2 className='mb-2 text-lg font-bold text-gray-800'>
                "{selectedNoticeForOptions?.title || '공지'}" 공지를
                완료하시겠어요?
              </h2>
              <p className='mb-10 text-sm text-gray-500'>
                완료 처리된 공지는 현재 공지 목록에서 제외돼요.
              </p>
              <div className='flex gap-2'>
                <button
                  className='flex-1 rounded-lg border-none bg-gray-100 py-3 font-semibold text-gray-700'
                  onClick={() => setIsNoticeCompleteModalOpen(false)}
                >
                  취소
                </button>
                <button
                  className='flex-1 rounded-lg border-none bg-gray-100 py-3 font-semibold text-blue-600'
                  onClick={confirmCompleteNotice}
                >
                  완료하기
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      <div className='flex w-full flex-grow flex-col bg-white px-10'>
        {/* 제목 */}
        <h1 className='text-3xl font-bold'>
          {tripTitle ? (
            <>
              {tripTitle}의
              <br />
              지난 공지예요
            </>
          ) : (
            '지난 공지사항 전체보기'
          )}
        </h1>

        {/* 현재 공지 */}
        <div className='mt-8'>
          <div className={titleStyle}>현재 공지</div>
          {currentNotices.length === 0 ? (
            <div className={`${cardBase} cursor-default bg-gray-50`}>
              <span className='text-base text-gray-600'>
                현재 진행 중인 공지가 없습니다.
              </span>
            </div>
          ) : (
            <div className='space-y-3'>
              {currentNotices.map((notice) => (
                <div
                  key={notice.id}
                  className={`${cardBase} bg-[var(--Blue-Scale-blue-100)]`}
                  onClick={() => fetchSpecificNotice(notice.id)}
                >
                  <div className='flex min-w-0 flex-1 items-center justify-between overflow-hidden'>
                    <div className='flex min-w-0 flex-col gap-1'>
                      <span className='truncate text-base font-medium text-gray-800'>
                        {notice.title || '제목 없음'}
                      </span>
                      <span className='truncate text-sm text-gray-400'>
                        {notice.createdAt
                          ? new Date(notice.createdAt).toLocaleString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''}
                      </span>
                    </div>
                    <button
                      className='flex-shrink-0 border-none bg-transparent p-2'
                      onClick={(e) => handleKebabClick(e, notice)}
                    >
                      <KebabIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 지난 공지 */}
        <div className='mt-10'>
          <div className={titleStyle}>지난 공지</div>
          {pastNotices.length === 0 ? (
            <div className={`${cardBase} cursor-default bg-gray-50`}>
              <span className='text-base text-gray-600'>
                지난 공지사항이 없습니다.
              </span>
            </div>
          ) : (
            <div className='space-y-3'>
              {pastNotices.map((notice) => (
                <div
                  key={notice.id}
                  className={`${cardBase} bg-gray-100`}
                  onClick={() => fetchSpecificNotice(notice.id)}
                >
                  <div className='flex min-w-0 flex-1 items-center justify-between overflow-hidden'>
                    <div className='flex min-w-0 flex-col gap-1'>
                      <span className='truncate text-base font-medium text-gray-600'>
                        {notice.title || '제목 없음'}
                      </span>
                      <span className='truncate text-sm text-gray-400'>
                        {notice.createdAt
                          ? new Date(notice.createdAt).toLocaleString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''}
                      </span>
                    </div>
                    <button
                      className='flex-shrink-0 border-none bg-transparent p-2'
                      onClick={(e) => handleKebabClick(e, notice)}
                    >
                      <KebabIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PastNotices
