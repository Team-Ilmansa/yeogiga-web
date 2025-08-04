import PlaceIcon from '@/assets/dashboard/PlaceIcon'
import { Archive } from 'lucide-react'
import { useEffect, useState } from 'react'
import useAuth from '@/hooks/useAuth'
import readNoticeApi from '@/apis/notice/readNoticeApi'
import { useNavigate, useParams } from 'react-router-dom'
import deleteNoticeApi from '@/apis/notice/deleteNoticeApi'
import readSpecificNoticeApi from '@/apis/notice/readSpecificNoticeApi'
import readPinApi from '@/apis/pin/readPinApi'

const Notices = () => {
  const { user } = useAuth()
  const { tripId, noticeId } = useParams()
  const navigate = useNavigate()
  const [notices, setNotices] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedNotice, setSelectedNotice] = useState(null)
  /** 집결지 데이터 상태 추가 */
  const [pinData, setPinData] = useState(null)
  const [hasPin, setHasPin] = useState(true)

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
        {/** TODO: 집결지 생성 API 연동 후 확인 */}
        <div className={containerStyle}>
          <PlaceIcon className='h-6 w-6' />
          <div className='flex items-baseline gap-2'>
            {hasPin && pinData ? (
              <>
                <span className={fontStyle}>{pinData.place}</span>
                <span className='text-sm text-indigo-300'>
                  {pinData.time ? new Date(pinData.time).toLocaleString() : ''}
                </span>
              </>
            ) : (
              <span className={fontStyle}>집결지 없음</span>
            )}
          </div>
        </div>
        {/** 공지사항 */}
        {notices.length === 0 ? (
          <div className={containerStyle}>
            <Archive className='h-6 w-6 text-[var(--Blue-Scale-blue-500)]' />
            <div className={fontStyle}>현재 공지사항 없음</div>
          </div>
        ) : (
          <div
            className={containerStyle}
            onClick={() => fetchSpecificNotice(notices[0].id)}
          >
            <Archive className='h-6 w-6 text-[var(--Blue-Scale-blue-500)]' />
            <div className='flex flex-col'>
              <span className={fontStyle}>
                {notices[0].title || '제목 없음'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notices
