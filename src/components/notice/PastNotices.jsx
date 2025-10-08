import readNoticeApi from '@/apis/notice/readNoticeApi'
import deleteNoticeApi from '@/apis/notice/deleteNoticeApi'
import { Archive } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import updateNoticeApi from '@/apis/notice/updateNoticeApi'

const PastNotices = () => {
  const { user } = useAuth()
  const { tripId } = useParams()
  const [notices, setNotices] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedNoticeId, setSelectedNoticeId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')

  /** 전체 공지사항 불러오기 API 호출 */
  useEffect(() => {
    if (user && tripId) {
      const fetchNotice = async () => {
        try {
          const result = await readNoticeApi(tripId)
          setNotices(result.data.content)
        } catch (err) {
          console.error(err)
        }
      }
      fetchNotice()
    }
  }, [user, tripId])

  /** 공지사항 삭제 API 호출 */
  const deleteNotice = async () => {
    if (!selectedNoticeId) return

    try {
      await deleteNoticeApi(tripId, selectedNoticeId)
      alert('정상적으로 삭제되었습니다.')
      const result = await readNoticeApi(tripId)
      setNotices(result.data.content)
      setIsModalOpen(false)
      setSelectedNoticeId(null)
    } catch (err) {
      alert(err.message)
    }
  }

  /** 공지사항 수정 API 호출 */
  const updateNotice = async () => {
    try {
      await updateNoticeApi(tripId, selectedNoticeId, {
        title: editTitle,
        description: editDesc,
      })
      alert('정상적으로 수정되었습니다.')

      const result = await readNoticeApi(tripId)
      setNotices(result.data.content)
      setIsModalOpen(false)
      setSelectedNoticeId(null)
    } catch (err) {
      alert(err.message)
    }
  }
  /** 공지사항 클릭 시 수정, 삭제를 위한 모달 열기 */
  const handleNoticeClick = (id) => {
    const notice = notices.find((n) => n.id === id)
    if (!notice) return

    setSelectedNoticeId(id)
    setEditTitle(notice.title || '')
    setEditDesc(notice.description || '')
    setIsModalOpen(true)
  }

  /** 모달 버튼 공통 스타일 */
  const modalButtonStyle =
    'rounded-xl bg-gray-100 text-m font-semibold text-gray-600 border-none w-1/2'

  return (
    <div className='flex w-full flex-col gap-6 bg-[var(--Grey-Scale-grey-50)] px-10 pt-10 pb-20'>
      <h1 className='text-4xl font-bold'>지난 공지사항 전체보기</h1>

      {/** 공지사항 수정 및 삭제 모달 */}
      {/* TODO: 디자인 변경 예정 */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          <div className='w-[400px] rounded-2xl bg-white p-6 shadow-xl'>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              공지를 수정하거나 삭제할 수 있어요
            </h3>
            <p className='mb-4 text-sm text-gray-500'>
              삭제한 공지는 복구할 수 없어요
            </p>

            {/** 제목 입력 */}
            <input
              type='text'
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder='제목을 입력하세요'
              className='mb-2 w-full rounded-xl border-none bg-gray-100 px-3 py-2 text-sm outline-none'
            />

            {/** 내용 입력 */}
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              placeholder='내용을 입력하세요'
              rows={4}
              className='mb-4 w-full resize-none rounded-xl bg-gray-100 px-3 py-2 text-sm outline-none'
            />

            <div className='flex gap-2'>
              <button
                className={modalButtonStyle}
                onClick={deleteNotice}
                style={{ color: '#FF0000' }}
              >
                삭제하기
              </button>
              <button
                className={modalButtonStyle}
                onClick={updateNotice}
                style={{ color: '#2563eb' }}
              >
                수정하기
              </button>
            </div>
            <div className='mt-3 flex justify-center'>
              <button
                className='text-m w-full rounded-xl border-none bg-gray-100 px-4 py-2 font-semibold text-gray-600'
                onClick={() => {
                  setIsModalOpen(false)
                  setSelectedNoticeId(null)
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 공지사항 리스트 */}
      {notices.length === 0 ? (
        <div className='mt-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-5 shadow'>
          <Archive className='h-6 w-6 text-[var(--Blue-Scale-blue-500)]' />
          <span className='text-base font-medium text-gray-700'>
            공지사항이 없습니다.
          </span>
        </div>
      ) : (
        <div className='space-y-4'>
          {notices.map((notice) => (
            <div
              key={notice.id}
              className='flex cursor-pointer items-center gap-3 rounded-2xl bg-white px-4 py-5 shadow'
              onClick={() => handleNoticeClick(notice.id)}
            >
              <Archive className='h-6 w-6 text-indigo-400' />
              <div className='flex flex-col'>
                <span className='text-base font-medium text-gray-700'>
                  {notice.title || '제목 없음'}
                </span>
                <span className='text-sm text-gray-400'>
                  {notice.createdAt
                    ? new Date(notice.createdAt).toLocaleString()
                    : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PastNotices
