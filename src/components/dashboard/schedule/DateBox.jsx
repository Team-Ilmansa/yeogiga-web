import ArrowUp from '@/assets/dashboard/ArrowUp'
import ArrowDown from '@/assets/dashboard/ArrowDown'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import readDatePlaceApi from '@/apis/dashboard/readDatePlaceApi'
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import SortablePlaceItem from './SortablePlaceItem'
import updatePlaceOrderApi from '@/apis/dashboard/updatePlaceOrderApi'

/**일자별 일정 박스 */
const DateBox = ({ date, dayIndex }) => {
  /**토글 여부 */
  const [isOpen, setIsOpen] = useState(false)
  /**일차별 장소 */
  const [places, setPlaces] = useState([])

  const navigate = useNavigate()
  const { tripId } = useParams()

  const toggleOpen = () => setIsOpen((prev) => !prev)

  /**일자별 장소 불러오기 */
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
  }, [dayIndex, tripId])

  /**드래그 종료 시 실행할 함수 */
  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return

    const prev = places
    const oldIndex = places.findIndex((p) => p.id === active.id)
    const newIndex = places.findIndex((p) => p.id === over.id)

    // 순서 바꾸기
    const next = arrayMove(places, oldIndex, newIndex)
    setPlaces(next)

    /**API 양식에 맞게 변경 */
    const body = {
      orderedPlaceIds: next.map((place) => place.id),
    }

    try {
      await updatePlaceOrderApi(tripId, dayIndex, body)
    } catch (err) {
      alert(err.message)
      // 실패할 경우 롤백
      setPlaces(prev)
    }
  }

  return (
    <div className='no-swipe-zone w-full rounded-[20px] border border-gray-300 bg-white px-4 py-3 drop-shadow'>
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
        <div className='mt-[5px] flex flex-col justify-center px-5 pt-5'>
          {places.length > 0 ? (
            <>
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={places.map((p) => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <ul className='space-y-2'>
                    {places.map((place) => (
                      <SortablePlaceItem
                        key={place.id}
                        id={place.id}
                        name={place.name}
                      />
                    ))}
                  </ul>
                </SortableContext>
              </DndContext>
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
