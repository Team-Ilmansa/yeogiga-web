/**체크 표시 svg */
const Check = ({ color }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 12 12'
      fill='none'
    >
      <path
        d='M10 3L4.5 8.5L2 6'
        stroke={color}
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  )
}

export default Check
