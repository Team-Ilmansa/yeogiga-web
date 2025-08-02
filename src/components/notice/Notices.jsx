import PlaceIcon from '@/assets/dashboard/PlaceIcon'
import { Archive } from 'lucide-react'
import { useEffect, useState } from 'react'
import useAuth from '@/hooks/useAuth'
import readNoticeApi from '@/apis/notice/readNoticeApi'
import { useParams } from 'react-router-dom'

const Notices = () => {
  const { user } = useAuth()
  const { tripId } = useParams()
  const [notices, setNotices] = useState([])

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

  /**보라색 박스 공통 스타일링 지정 */
  const containerStyle =
    'flex items-center gap-3 rounded-2xl bg-[var(--Blue-Scale-blue-100)]  px-4 py-5'
  /**폰트 스타일링 지정 */
  const fontStyle = 'text-base font-medium text-gray-700'

  return (
    <div className='space-y-2'>
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
        {/**집결지 */}
        <div className={containerStyle}>
          <PlaceIcon className='h-6 w-6' />
          <div className='flex items-baseline gap-2'>
            <span className={fontStyle}>Text</span>
            <span className='text-sm text-indigo-300'>Time</span>
          </div>
        </div>

        {/** 공지사항 */}
        {notices.length === 0 ? (
          <div className={containerStyle}>
            <Archive className='h-6 w-6 text-[var(--Blue-Scale-blue-500)]' />
            <div className={fontStyle}>현재 공지사항 없음</div>
          </div>
        ) : (
          notices.map((notice, index) => (
            <div key={index} className={containerStyle}>
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
