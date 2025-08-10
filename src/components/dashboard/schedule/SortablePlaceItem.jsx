import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

/**Drag & Drop을 적용하기 위한 컴포넌트 */
const SortablePlaceItem = ({ id, name }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className='flex items-center justify-start gap-5'
      {...attributes}
      {...listeners}
    >
      <div className='flex h-10 w-10 cursor-grab items-center justify-center rounded-full bg-[var(--Grey-Scale-grey-100)]'>
        C
      </div>
      <div className='w-full rounded-2xl bg-[var(--Grey-Scale-grey-100)] p-5 text-base text-[var(--Grey-Scale-grey-300)]'>
        {name}
      </div>
    </li>
  )
}

export default SortablePlaceItem
