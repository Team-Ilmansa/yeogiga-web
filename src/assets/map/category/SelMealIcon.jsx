/** 선택 식사 아이콘 */
const SelMealIcon = ({
  size = 24, // 아이콘 크기(px)
  color = 'white', // 선 색상
  bg = '#8CB6E8', // 배경 색상
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
      <path
        d='M10.8998 9.15C10.8998 10.3926 10.0939 11.4 9.0998 11.4C8.10569 11.4 7.2998 10.3926 7.2998 9.15C7.2998 7.90736 7.7498 6 9.0998 6C10.4498 6 10.8998 7.90736 10.8998 9.15Z'
        stroke={color}
        strokeWidth='1.33'
      />
      <path
        d='M8.43461 18C8.43461 18.3673 8.73234 18.665 9.09961 18.665C9.46688 18.665 9.76461 18.3673 9.76461 18H8.43461ZM9.09961 11.4H8.43461V18H9.09961H9.76461V11.4H9.09961Z'
        fill={color}
      />
      <path
        d='M13.2998 6V18'
        stroke={color}
        strokeWidth='1.33'
        strokeLinecap='round'
      />
      <path
        d='M15.7002 6V18'
        stroke={color}
        strokeWidth='1.33'
        strokeLinecap='round'
      />
    </svg>
  )
}

export default SelMealIcon
