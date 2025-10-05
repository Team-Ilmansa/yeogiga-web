import PlaceIcon from '@/assets/dashboard/PlaceIcon'
import { Archive } from 'lucide-react'
import { useEffect, useState } from 'react'
import useAuth from '@/hooks/useAuth'
import readNoticeApi from '@/apis/notice/readNoticeApi'
import { useNavigate, useParams } from 'react-router-dom'
import deleteNoticeApi from '@/apis/notice/deleteNoticeApi'
import readSpecificNoticeApi from '@/apis/notice/readSpecificNoticeApi'
import readPinApi from '@/apis/pin/readPinApi'
import KebabIcon from '@/assets/dashboard/KebabIcon'

const Notices = () => {
  const { user } = useAuth()
  const { tripId, noticeId, day } = useParams()
  const navigate = useNavigate()
  const [notices, setNotices] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedNotice, setSelectedNotice] = useState(null)
  /** 집결지 데이터 상태 추가 */
  const [pinData, setPinData] = useState(null)
  const [hasPin, setHasPin] = useState(true)

  // --- 추가: 케밥 메뉴 및 삭제 모달 상태 ---
  const [openMenuId, setOpenMenuId] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  /**전체 공지사항 조회 API 호출 */
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

  /** 특정 공지사항 조회 API 호출 */
  const fetchSpecificNotice = async (id) => {
    try {
      const result = await readSpecificNoticeApi(tripId, id)
      setSelectedNotice(result.data)
      setIsModalOpen(true)
    } catch (err) {
      console.error(err)
    }
  }

  /** 집결지 핀 조회 API 호출 */
  useEffect(() => {
    if (tripId) {
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
    }
  }, [tripId])

  /**집결지 핀 삭제 API 호출 */
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
      // 성공/실패와 관계없이 메뉴와 모달을 닫음
      setOpenMenuId(null)
      setIsDeleteModalOpen(false)
    }
  }

  /**보라색 박스 공통 스타일링 지정 */
  const containerStyle =
    'flex items-center gap-3 rounded-2xl bg-[var(--Blue-Scale-blue-100)]  px-4 py-5'
  /**폰트 스타일링 지정 */
  const fontStyle = 'text-base font-medium text-gray-700'
  /**모달 버튼 스타일링 지정 */
  const modalButtonStyle =
    'rounded-xl bg-gray-100 text-m font-semibold text-gray-600 border-none w-1/2'

  return (
    <div className='space-y-2'>
      {/* 특정 공지사항 조회 모달 */}
      {isModalOpen && selectedNotice && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          <div className='w-[400px] rounded-2xl bg-white p-6 shadow-xl'>
            {/* 작성자 프로필 및 닉네임 */}
            <div className='mb-4 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <img
                  src={selectedNotice.imageUrl || '/images/default_profile.png'}
                  className='h-10 w-10 rounded-full object-cover'
                />
                <span className='text-sm font-medium text-gray-800'>
                  {selectedNotice.nickname || '작성자 없음'}
                </span>
              </div>
              {/* 작성일 표시 */}
              <span className='text-xs text-gray-400'>
                {selectedNotice.createdAt
                  ? new Date(selectedNotice.createdAt).toLocaleString()
                  : ''}
              </span>
            </div>
            <h2 className='mb-2 text-xl font-semibold text-gray-900'>
              {selectedNotice.title || '제목 없음'}
            </h2>

            <p className='mb-4 text-sm whitespace-pre-wrap text-gray-700'>
              {selectedNotice.description || '내용 없음'}
            </p>

            {/* 닫기 버튼 */}
            <div className='mt-4 flex'>
              <button
                className='text-m w-full rounded-xl border-none bg-gray-100 px-4 py-3 font-bold text-gray-600'
                onClick={() => {
                  setIsModalOpen(false)
                  setSelectedNotice(null)
                }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 추가: 집결지 삭제 확인 모달 --- */}
      {isDeleteModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          <div className='w-[350px] rounded-2xl bg-white p-6 text-center shadow-xl'>
            <h2 className='mb-2 text-lg font-bold text-gray-800'>
              “집결지”을 정말로 삭제하시겠어요?
            </h2>
            <p className='mb-6 text-sm text-gray-500'>
              해당 작업은 복구할 수 없어요
            </p>
            <div className='flex gap-3'>
              <button
                className='flex-1 rounded-lg border-none bg-gray-100 py-3 font-semibold text-gray-700'
                onClick={() => setIsDeleteModalOpen(false)}
              >
                취소
              </button>
              <button
                className='flex-1 rounded-lg border-none bg-red-500 py-3 font-semibold text-white'
                onClick={handleDeletePin}
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/**헤더 영역 */}
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl leading-normal font-bold'>현재 공지</h1>
        {/** TODO: 지난 공지 전체보기 버튼 연결 */}
        <button
          onClick={() => navigate(`/trip/${tripId}/past/notices`)}
          className='mt-2 flex items-center border-none text-base text-gray-400 hover:text-gray-500'
        >
          지난 공지 전체보기
        </button>
      </div>

      {/**현재 공지 리스트 */}
      <div className='space-y-3'>
        {/* --- 집결지 박스 수정 --- */}
        <div
          className={containerStyle + ' cursor-pointer'}
          onClick={() => {
            if (openMenuId === 'pin-menu') return
            if (hasPin && pinData)
              navigate(
                `/trip/${tripId}/map/${day}?lat=${pinData.latitude}&lng=${pinData.longitude}`,
              )
          }}
        >
          <div className='flex items-center gap-3'>
            <PlaceIcon className='h-6 w-6' />
            <div className='flex items-baseline gap-2'>
              {hasPin && pinData ? (
                <>
                  <span className={fontStyle}>{pinData.place}</span>
                  <span className='text-sm text-indigo-300'>
                    {pinData.time
                      ? new Date(pinData.time).toLocaleString()
                      : ''}
                  </span>
                </>
              ) : (
                <span className={fontStyle}>집결지 없음</span>
              )}
            </div>
          </div>

          {hasPin && (
            <div className='relative'>
              <button
                className='border-none bg-transparent p-2'
                onClick={(e) => {
                  e.stopPropagation()
                  setOpenMenuId(openMenuId === 'pin-menu' ? null : 'pin-menu')
                }}
              >
                <KebabIcon />
              </button>
              {openMenuId === 'pin-menu' && (
                <div className='absolute top-full right-0 z-10 mt-2 w-24 rounded-md bg-white py-1 shadow-lg'>
                  <a
                    href='#'
                    className='block px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsDeleteModalOpen(true) // 모달 열기
                      setOpenMenuId(null) // 드롭다운 닫기
                    }}
                  >
                    삭제
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/** 공지사항 (기존 코드 유지) */}
        {notices.length === 0 ? (
          <div className={`${containerStyle} justify-between`}>
            <div className='flex items-center gap-3'>
              <Archive className='h-6 w-6 text-[var(--Blue-Scale-blue-500)]' />
              <div className={fontStyle}>현재 공지사항 없음</div>
            </div>
            {/* <KebabIcon /> */}
          </div>
        ) : (
          notices.map((notice) => (
            <div
              key={notice.id}
              className={`${containerStyle} flex cursor-pointer items-center justify-between`}
              onClick={() => fetchSpecificNotice(notice.id)}
            >
              <div className='flex items-center gap-3'>
                <Archive className='h-6 w-6 text-[var(--Blue-Scale-blue-500)]' />
                <span className={fontStyle}>{notice.title || '제목 없음'}</span>
              </div>
              <KebabIcon />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Notices
