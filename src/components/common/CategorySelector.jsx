import TouristIcon from '@/assets/map/category/TouristIcon'
import SelTouristIcon from '@/assets/map/category/SelTouristIcon'
import LodgingIcon from '@/assets/map/category/LodgingIcon'
import SelLodgingIcon from '@/assets/map/category/SelLodgingIcon'
import MealIcon from '@/assets/map/category/MealIcon'
import SelMealIcon from '@/assets/map/category/SelMealIcon'
import TransportIcon from '@/assets/map/category/TransportIcon'
import SelTransportIcon from '@/assets/map/category/SelTransportIcon'
import EtcIcon from '@/assets/map/category/EtcIcon'
import SelEtcIcon from '@/assets/map/category/SelEtcIcon'

/**카테고리 라벨 설정 */
export const CATEGORY = {
  TOURISM: {
    key: 'TOURISM',
    label: '관광지',
    Icon: TouristIcon,
    SelIcon: SelTouristIcon,
  },
  LODGING: {
    key: 'LODGING',
    label: '숙소',
    Icon: LodgingIcon,
    SelIcon: SelLodgingIcon,
  },
  RESTAURANT: {
    key: 'RESTAURANT',
    label: '식사',
    Icon: MealIcon,
    SelIcon: SelMealIcon,
  },
  TRANSPORT: {
    key: 'TRANSPORT',
    label: '이동수단',
    Icon: TransportIcon,
    SelIcon: SelTransportIcon,
  },
  ETC: { key: 'ETC', label: '기타', Icon: EtcIcon, SelIcon: SelEtcIcon },
}

export const CATEGORY_ORDER = [
  'TOURISM',
  'LODGING',
  'RESTAURANT',
  'TRANSPORT',
  'ETC',
]
export const getCategoryLabel = (key) => CATEGORY[key]?.label ?? ''

const CategorySelector = ({
  value,
  onChange,
  size = 50,
  className = '',
  showLabels = true,
  disabledKeys = [],
}) => {
  return (
    <div
      className={`flex items-center gap-1 ${className}`}
      role='group'
      aria-label='카테고리 선택'
    >
      {CATEGORY_ORDER.map((key) => {
        const { label, Icon, SelIcon } = CATEGORY[key]
        const selected = value === key
        const Comp = selected ? SelIcon : Icon
        const disabled = disabledKeys.includes(key)

        return (
          <button
            key={key}
            type='button'
            onClick={() => !disabled && onChange?.(key)}
            disabled={disabled}
            className={`flex flex-col items-center justify-center border-none bg-transparent px-1 py-1 transition outline-none hover:opacity-90 focus:ring-0 ${disabled ? 'cursor-not-allowed opacity-40' : ''}`}
            aria-pressed={selected}
            aria-label={label}
          >
            <Comp size={size} />
            {showLabels && (
              <span
                className={`mt-1 text-sm ${
                  selected
                    ? 'text-[var(--Grey-Scale-grey-400)]'
                    : 'text-[var(--Grey-Scale-grey-300)]'
                }`}
              >
                {label}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default CategorySelector
