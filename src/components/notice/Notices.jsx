import PlaceIcon from '@/assets/dashboard/PlaceIcon'
import { Archive } from 'lucide-react'
import { useEffect, useState } from 'react'
import useAuth from '@/hooks/useAuth'
import readNoticeApi from '@/apis/notice/readNoticeApi'
import { useNavigate, useParams } from 'react-router-dom'
import deleteNoticeApi from '@/apis/notice/deleteNoticeApi'

const Notices = () => {
  const { user } = useAuth()
  const { tripId } = useParams()
  const navigate = useNavigate()
  const [notices, setNotices] = useState([])
  const [selectedNoticeId, setSelectedNoticeId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  /**공지사항 삭제 API 호출 */
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

  /**공지사항 클릭 시 모달 열기 */
  const handleNoticeClick = (id) => {
    setSelectedNoticeId(id)
    setIsModalOpen(true)
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
      {/**삭제 모달 */}
      {/* TODO: 모달 위치 옮기기 */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          <div className='h-[180px] w-[380px] rounded-2xl bg-white p-6 shadow-xl'>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              공지를 정말로 삭제하시겠어요?
            </h3>
            <p className='mb-4 text-sm'>삭제한 공지는 복구할 수 없어요.</p>
            <div className='mt-10 flex gap-2'>
              <button
                className={modalButtonStyle}
                onClick={() => {
                  setIsModalOpen(false)
                  setSelectedNoticeId(null)
                }}
              >
                취소
              </button>
              <button
                className={modalButtonStyle}
                onClick={deleteNotice}
                style={{ color: '#FF0000' }}
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
        {/* TODO: 지난 공지 전체보기 버튼 연결 */}
        <button className='mt-2 flex items-center border-none text-base text-gray-400 hover:text-gray-500'>
          지난 공지 전체보기
        </button>
      </div>

      {/**현재 공지 리스트 */}
      <div className='space-y-3'>
        {/* TODO: 집결지 API 연동 */}
        <div className={containerStyle}>
          <PlaceIcon className='h-6 w-6' />
          <div className='flex items-baseline gap-2'>
            <span className={fontStyle}>Text</span>
            <span className='text-sm text-indigo-300'>Time</span>
          </div>
        </div>

        {/** 공지사항 */}
        {/* TODO: 가장 최신 공지사항 하나만 보이도록 구현(지난 공지  전체보기 구현 후) */}
        {notices.length === 0 ? (
          <div className={containerStyle}>
            <Archive className='h-6 w-6 text-[var(--Blue-Scale-blue-500)]' />
            <div className={fontStyle}>현재 공지사항 없음</div>
          </div>
        ) : (
          notices.map((notice) => (
            <div
              key={notice.id}
              className={containerStyle}
              onClick={() => handleNoticeClick(notice.id)} // ✅ 클릭 시 모달 오픈
            >
              <Archive className='h-6 w-6 text-indigo-400' />
              <div className={fontStyle}>{notice.title || '제목 없음'}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Notices
