import React from 'react'

const LocationIcon = ({ className }) => {
  return (
    <svg
      className={className}
      viewBox='0 0 18 18'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      stroke='currentColor'
      style={{ transform: 'translateX(2px)' }}
    >
      <path
        d='M7 9.75C8.24264 9.75 9.25 8.74264 9.25 7.5C9.25 6.25736 8.24264 5.25 7 5.25C5.75736 5.25 4.75 6.25736 4.75 7.5C4.75 8.74264 5.75736 9.75 7 9.75Z'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M7 16.5C10 13.5 13 10.8137 13 7.5C13 4.18629 10.3137 1.5 7 1.5C3.68629 1.5 1 4.18629 1 7.5C1 10.8137 4 13.5 7 16.5Z'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default LocationIcon
