import ArrowUp from '@/assets/dashboard/ArrowUp'
import ArrowDown from '@/assets/dashboard/ArrowDown'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import readDatePlaceApi from '@/apis/dashboard/readDatePlaceApi'

/**일자별 일정 박스 */
const DateBox = ({ date, dayIndex }) => {
  console.log(dayIndex)
  const navigate = useNavigate()
  /**토글 열림 여부 */
  const [isOpen, setIsOpen] = useState(false)
  /**일자별 장소 */
  const [places, setPlaces] = useState([])

  const { tripId } = useParams()

  const toggleOpen = () => setIsOpen((prev) => !prev)

  useEffect(() => {
    const fetchDatePlaces = async () => {
      try {
        const result = await readDatePlaceApi(tripId, dayIndex)
        setPlaces(result.data)
      } catch (err) {
        alert(err.message)
      }
    }
    fetchDatePlaces()
  }, [dayIndex])

  return (
    <div className='w-full rounded-[20px] border border-gray-300 bg-white px-4 py-3 drop-shadow'>
      <div
        className='flex cursor-pointer items-center justify-between'
        onClick={toggleOpen}
      >
        <div className='text-base text-gray-400'>{date || '여행 전체'}</div>
        {isOpen ? (
          <ArrowUp
            className='text-gray-400 transition-transform duration-300'
            size={18}
          />
        ) : (
          <ArrowDown
            className='text-gray-400 transition-transform duration-300'
            size={18}
          />
        )}
      </div>

      {isOpen && (
        <div className='mt-[5px] flex flex-col gap-2 px-5 pt-10'>
          {places.length > 0 ? (
            <>
              {places.map((place) => (
                <div className='flex items-center justify-start gap-5'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[var(--Grey-Scale-grey-100)]'>
                    C
                  </div>
                  <div className='w-full rounded-2xl bg-[var(--Grey-Scale-grey-100)] p-5 text-base text-[var(--Grey-Scale-grey-300)]'>
                    {place.name}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className='text-center text-base text-gray-400'>
              아직 예정된 일정이 없어요
            </div>
          )}

          <div
            onClick={() => navigate(`map/${dayIndex}`)}
            className='mt-2 cursor-pointer py-5 text-center text-base text-[var(--Blue-Scale-blue-500)]'
          >
            + 일정 담으러 가기
          </div>
        </div>
      )}
    </div>
  )
}

export default DateBox
