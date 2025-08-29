import ArrowUp from '@/assets/dashboard/ArrowUp'
import ArrowDown from '@/assets/dashboard/ArrowDown'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
import readPlanningDatePlaceApi from '@/apis/planning-dashboard/readPlanningDatePlaceApi'
import updatePlanningPlaceOrderApi from '@/apis/planning-dashboard/updatePlaceOrderApi'
import deletePlanningDatePlaceApi from '@/apis/planning-dashboard/deletePlanningDatePlaceApi'
import { createPortal } from 'react-dom'
import checkVisitStatusApi from '@/apis/planning-dashboard/checkVisitStatusApi'

/**확정 후 일자별 일정 박스 */
const PlanningDateBox = ({
  date,
  dayIndex,
  tripInfo,
  selected,
  onSelect,
  planningPlaces,
}) => {
  /**토글 여부 */
  const [isOpen, setIsOpen] = useState(false)
  /**일차별 장소 */
  const [places, setPlaces] = useState([])
  /**삭제 메뉴 */
  const [ctxMenu, setCtxMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    placeId: null,
    placeName: '',
  })

  const navigate = useNavigate()
  const { tripId } = useParams()

  useEffect(() => {
    setPlaces(planningPlaces?.places)
  }, [planningPlaces])

  const toggleOpen = () => {
    setIsOpen((prev) => !prev)
  }

  /**우클릭으로 삭제 메뉴 열기 */
  const handleContextMenu = (e, place) => {
    e.preventDefault()
    const MENU_W = 160
    const MENU_H = 48
    const PADDING = 8
    const x = Math.min(e.clientX + 2, window.innerWidth - MENU_W - PADDING)
    const y = Math.min(e.clientY + 2, window.innerHeight - MENU_H - PADDING)

    setCtxMenu({
      visible: true,
      x,
      y,
      placeId: place.id,
      placeName: place.name,
      isVisited: place.isVisited,
    })
  }

  // 바깥 클릭 or ESC로 닫기
  useEffect(() => {
    if (!ctxMenu.visible) return
    const close = () => setCtxMenu((prev) => ({ ...prev, visible: false }))
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('click', close)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', close)
      document.removeEventListener('keydown', onKey)
    }
  }, [ctxMenu.visible])

  /**삭제 함수 */
  const handleDelete = async () => {
    const id = ctxMenu.placeId
    setCtxMenu((prev) => ({ ...prev, visible: false }))
    const prev = places
    const next = prev.filter((p) => p.id !== id)
    setPlaces(next)

    try {
      deletePlanningDatePlaceApi(tripId, planningPlaces.id, ctxMenu.placeId)
    } catch (err) {
      alert(err.message)
      setPlaces(prev) // 롤백
    }
  }

  /**목적지 방문 여부 체크 함수 */
  const handleVisited = async () => {
    const id = ctxMenu.placeId
    setCtxMenu((prev) => ({ ...prev, visible: false }))

    const target = places.find((p) => p.id === id)
    if (!target) return

    const newVisited = !target.isVisited

    const next = places.map((p) =>
      p.id === id ? { ...p, isVisited: newVisited } : p,
    )
    setPlaces(next)

    try {
      const body = { isVisited: newVisited }

      await checkVisitStatusApi(
        tripId,
        planningPlaces.id,
        ctxMenu.placeId,
        body,
      )
    } catch (err) {
      alert(err.message)
    }
  }

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
      await updatePlanningPlaceOrderApi(tripId, planningPlaces.id, body)
    } catch (err) {
      alert(err.message)
      // 실패할 경우 롤백
      setPlaces(prev)
    }
  }

  return (
    <div
      className={`no-swipe-zone w-full rounded-[20px] border bg-white px-4 py-3 drop-shadow ${selected ? 'border-[var(--Blue-Scale-blue-500)]' : 'border-gray-300'}`}
      onClick={onSelect}
    >
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
        <div className='mt-[5px] flex flex-col justify-center px-5'>
          {places.length > 0 ? (
            <div className='pt-5'>
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
                        place={place}
                        onContextMenu={(e) => handleContextMenu(e, place)}
                      />
                    ))}
                  </ul>
                </SortableContext>
              </DndContext>
            </div>
          ) : (
            <div className='text-center text-base text-gray-400'>
              아직 예정된 일정이 없어요
            </div>
          )}
        </div>
      )}
      {/* 컨텍스트 메뉴 */}
      {ctxMenu.visible &&
        createPortal(
          <div
            className='fixed z-[9999] min-w-[140px] rounded-xl border border-gray-200 bg-white p-1 shadow-xl'
            style={{ left: ctxMenu.x, top: ctxMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type='button'
              className='block w-full rounded-lg border-none px-3 py-2 text-left text-sm hover:bg-red-50 hover:text-red-600'
              onClick={handleDelete}
            >
              삭제
            </button>
            <button
              type='button'
              className='block w-full rounded-lg border-none px-3 py-2 text-left text-sm hover:bg-[var(--Blue-Scale-blue-100)] hover:text-[var(--Blue-Scale-blue-500)]'
              onClick={handleVisited}
            >
              {ctxMenu.isVisited ? '미완료' : '완료'}
            </button>
          </div>,
          document.body,
        )}
    </div>
  )
}

export default PlanningDateBox
