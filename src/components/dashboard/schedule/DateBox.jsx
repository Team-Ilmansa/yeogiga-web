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
import { createPortal } from 'react-dom'
import deleteDatePlaceApi from '@/apis/dashboard/deleteDatePlaceApi'
import recommendDatePlaceOrderApi from '@/apis/dashboard/recommendDatePlaceOrderApi'

/**일자별 일정 박스 */
const DateBox = ({ date, dayIndex }) => {
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

  const toggleOpen = () => setIsOpen((prev) => !prev)

  /**일자별 담은 장소 불러오기 */
  const fetchDatePlaces = async () => {
    try {
      const result = await readDatePlaceApi(tripId, dayIndex)
      console.log(result)
      setPlaces(result.data)
    } catch (err) {
      alert(err.message)
    }
  }

  useEffect(() => {
    fetchDatePlaces()
  }, [dayIndex, tripId])

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
      deleteDatePlaceApi(tripId, dayIndex, ctxMenu.placeId)
    } catch (err) {
      alert(err.message)
      setPlaces(prev) // 롤백
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
      await updatePlaceOrderApi(tripId, dayIndex, body)
    } catch (err) {
      alert(err.message)
      // 실패할 경우 롤백
      setPlaces(prev)
    }
  }

  /**일정 추천받기 함수 */
  const handleRecommend = async () => {
    try {
      const result = await recommendDatePlaceOrderApi(tripId, dayIndex)
      console.log(result)
      fetchDatePlaces()
    } catch (err) {
      alert(err.message)
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
                        onContextMenu={(e) => handleContextMenu(e, place)}
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

          {places.length > 0 ? (
            <div className='mt-2 flex w-full justify-around py-5'>
              <div
                onClick={() => navigate(`map/${dayIndex}`)}
                className='cursor-pointer text-center text-base text-[var(--Blue-Scale-blue-500)]'
              >
                + 일정 담으러 가기
              </div>
              <div
                onClick={handleRecommend}
                className='cursor-pointer text-center text-base text-[var(--Blue-Scale-blue-500)]'
              >
                일정 추천 받기
              </div>
            </div>
          ) : (
            <div
              onClick={() => navigate(`map/${dayIndex}`)}
              className='mt-2 cursor-pointer py-5 text-center text-base text-[var(--Blue-Scale-blue-500)]'
            >
              + 일정 담으러 가기
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
          </div>,
          document.body,
        )}
    </div>
  )
}

export default DateBox
