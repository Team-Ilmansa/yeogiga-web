/**회원가입 절차 표시 */
const StepIndicator = ({ step, totalSteps }) => {
  return (
    <div className='flex gap-5'>
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
        <div
          key={s}
          className={`h-4 w-4 rounded-full ${
            step >= s
              ? 'bg-[var(--Blue-Scale-blue-500)]'
              : 'bg-[var(--Grey-Scale-grey-100)]'
          }`}
        ></div>
      ))}
    </div>
  )
}

export default StepIndicator
