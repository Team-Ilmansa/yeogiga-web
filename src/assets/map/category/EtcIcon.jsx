/** 기타 아이콘 (JS 버전) */
const EtcIcon = ({
  size = 40, // 아이콘 크기(px)
  color = '#C6C6C6', // 점 세 개 선 색
  bg = '#F0F0F0', // 원 배경 색
  className,
  ...rest
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 40 40'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      aria-hidden='true'
      focusable='false'
      {...rest}
    >
      <rect width='40' height='40' rx='20' fill={bg} />
      <path
        d='M18.8906 19.9993C18.8906 20.6129 19.3881 21.1104 20.0017 21.1104C20.6154 21.1104 21.1128 20.6129 21.1128 19.9993C21.1128 19.3856 20.6154 18.8882 20.0017 18.8882C19.3881 18.8882 18.8906 19.3856 18.8906 19.9993Z'
        stroke={color}
        strokeWidth='2.22222'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M26.6684 19.9993C26.6684 20.6129 27.1659 21.1104 27.7795 21.1104C28.3932 21.1104 28.8906 20.6129 28.8906 19.9993C28.8906 19.3856 28.3932 18.8882 27.7795 18.8882C27.1659 18.8882 26.6684 19.3856 26.6684 19.9993Z'
        stroke={color}
        strokeWidth='2.22222'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M11.1128 19.9993C11.1128 20.6129 11.6103 21.1104 12.224 21.1104C12.8376 21.1104 13.3351 20.6129 13.3351 19.9993C13.3351 19.3856 12.8376 18.8882 12.224 18.8882C11.6103 18.8882 11.1128 19.3856 11.1128 19.9993Z'
        stroke={color}
        strokeWidth='2.22222'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default EtcIcon
