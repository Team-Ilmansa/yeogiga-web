import { Link } from 'react-router-dom'

/**홈 아이콘 svg */
const MyPageIcon = ({ color, opacity }) => {
  return (
    <Link
      to='/mypage'
      className={`flex w-[100px] flex-col items-center opacity-${opacity}`}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='50'
        height='50'
        viewBox='0 0 32 32'
        fill='none'
      >
        <path
          d='M15.9995 20C11.7727 20 8.01387 22.0408 5.6208 25.208C5.10575 25.8896 4.84822 26.2304 4.85665 26.691C4.86315 27.0469 5.08662 27.4959 5.36663 27.7156C5.72906 28 6.2313 28 7.23578 28H24.7632C25.7677 28 26.2699 28 26.6323 27.7156C26.9123 27.4959 27.1358 27.0469 27.1423 26.691C27.1507 26.2304 26.8932 25.8896 26.3782 25.208C23.9851 22.0408 20.2262 20 15.9995 20Z'
          stroke={color}
          stroke-width='2.66667'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M15.9995 16C19.3132 16 21.9995 13.3137 21.9995 10C21.9995 6.68629 19.3132 4 15.9995 4C12.6858 4 9.99948 6.68629 9.99948 10C9.99948 13.3137 12.6858 16 15.9995 16Z'
          stroke={color}
          stroke-width='2.66667'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
      </svg>
      <div className='text-xl font-semibold' style={{ color }}>
        마이페이지
      </div>
    </Link>
  )
}

export default MyPageIcon
