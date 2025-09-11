/** 선택 관광지 아이콘 */
const SelTouristIcon = ({
  size = 24, // 아이콘 크기(px)
  color = 'white', // 선 색상
  bg = '#F87C7C', // 배경 색상
  className,
  ...rest
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      aria-hidden='true'
      focusable='false'
      {...rest}
    >
      <rect width='24' height='24' rx='12' fill={bg} />
      <g clipPath='url(#clip0_165_6758)'>
        <path
          d='M7.33301 13.5242C6.09877 14.0687 5.33301 14.8275 5.33301 15.6667C5.33301 17.3235 8.31778 18.6667 11.9997 18.6667C15.6816 18.6667 18.6663 17.3235 18.6663 15.6667C18.6663 14.8275 17.9006 14.0687 16.6663 13.5242M15.9997 9.33334C15.9997 12.0425 12.9997 13.3333 11.9997 15.3333C10.9997 13.3333 7.99967 12.0425 7.99967 9.33334C7.99967 7.1242 9.79054 5.33334 11.9997 5.33334C14.2088 5.33334 15.9997 7.1242 15.9997 9.33334ZM12.6663 9.33334C12.6663 9.70153 12.3679 10 11.9997 10C11.6315 10 11.333 9.70153 11.333 9.33334C11.333 8.96515 11.6315 8.66668 11.9997 8.66668C12.3679 8.66668 12.6663 8.96515 12.6663 9.33334Z'
          stroke={color}
          strokeWidth='1.33333'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>
      <defs>
        <clipPath id='clip0_165_6758'>
          <rect
            width='16'
            height='16'
            fill='white'
            transform='translate(4 4)'
          />
        </clipPath>
      </defs>
    </svg>
  )
}

export default SelTouristIcon
