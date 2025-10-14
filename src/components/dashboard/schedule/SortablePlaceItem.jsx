import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Check } from 'lucide-react'
import TouristIcon from '@/assets/map/category/TouristIcon'
import LodgingIcon from '@/assets/map/category/LodgingIcon'
import MealIcon from '@/assets/map/category/MealIcon'
import TransportIcon from '@/assets/map/category/TransportIcon'
import EtcIcon from '@/assets/map/category/EtcIcon'

const categoryIcons = {
  관광지: TouristIcon,
  숙소: LodgingIcon,
  식당: MealIcon,
  이동수단: TransportIcon,
  기타: EtcIcon,
}

const categoryColors = {
  관광지: '#F87C7C',
  숙소: '#66CD7A',
  식당: '#8CB6E8',
  이동수단: '#F19B55',
  기타: '#C161EE',
}

/**Drag & Drop을 적용하기 위한 컴포넌트 */
const SortablePlaceItem = ({ id, place, onContextMenu }) => {
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

  const isVisited = place.isVisited ?? false
  const Icon = categoryIcons[place.placeType] || EtcIcon
  const color = categoryColors[place.placeType] || '#C161EE'

  return (
    <li
      ref={setNodeRef}
      style={style}
      className='flex items-center justify-start gap-5'
      {...attributes}
      {...listeners}
      onContextMenu={onContextMenu}
    >
      <div className='flex h-10 w-10 cursor-grab items-center justify-center rounded-full'>
        <Icon size={40} color={color} />
      </div>
      <div
        className={`flex w-full justify-between rounded-2xl p-5 text-base ${
          isVisited
            ? 'bg-[var(--Blue-Scale-blue-100)] text-[var(--Blue-Scale-blue-500)]'
            : 'bg-[var(--Grey-Scale-grey-100)] text-[var(--Grey-Scale-grey-300)]'
        }`}
      >
        <span>{place.name}</span>
        {isVisited && (
          <Check className='h-6 w-6 text-[var(--Blue-Scale-blue-500)]' />
        )}
      </div>
    </li>
  )
}

export default SortablePlaceItem
