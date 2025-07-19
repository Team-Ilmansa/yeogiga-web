import React from 'react'

const UserIcon = ({ className }) => {
  return (
    <div className='items-center'>
      <svg
        className={className}
        viewBox='0 0 16 16'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M8.00038 10.25C5.62282 10.25 3.50847 11.398 2.16237 13.1795C1.87265 13.5629 1.7278 13.7546 1.73253 14.0137C1.7362 14.2139 1.8619 14.4664 2.0194 14.59C2.22327 14.75 2.50578 14.75 3.0708 14.75H12.93C13.495 14.75 13.7775 14.75 13.9814 14.59C14.1389 14.4664 14.2646 14.2139 14.2682 14.0137C14.273 13.7546 14.1281 13.5629 13.8384 13.1795C12.4923 11.398 10.3779 10.25 8.00038 10.25Z'
          stroke='#7D7D7D'
          stroke-width='1.5'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M8.00038 8C9.86434 8 11.3754 6.48896 11.3754 4.625C11.3754 2.76104 9.86434 1.25 8.00038 1.25C6.13642 1.25 4.62538 2.76104 4.62538 4.625C4.62538 6.48896 6.13642 8 8.00038 8Z'
          stroke='#7D7D7D'
          stroke-width='1.5'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
      </svg>
    </div>
  )
}

export default UserIcon
