const Spinner = ({ size = 24, color = 'white' }) => {
  return (
    <svg
      className={`animate-spin`}
      style={{ width: size, height: size }}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle
        cx='12'
        cy='12'
        r='10'
        stroke={color}
        strokeWidth='4'
        strokeOpacity='0.25'
      />
      <path
        fill={color}
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
      />
    </svg>
  )
}

export default Spinner
