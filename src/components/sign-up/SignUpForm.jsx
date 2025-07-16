import GoBack from '@/assets/sign-up/GoBack'
import RegisterEmail from './RegisterEmail'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StepIndicator from './StepIndicator'

/**회원가입 양식 */
const SignUpForm = () => {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)

  const handleBack = () => {
    if (step === 1) {
      navigate(-1)
    } else {
      setStep((prev) => prev - 1)
    }
  }

  return (
    <div className='flex w-full flex-col pt-5'>
      {/* 뒤로 가기 버튼 */}
      <div>
        <button
          className='text-bold my-5 border-none px-8'
          onClick={handleBack}
        >
          <GoBack />
        </button>
      </div>

      {step == 1 && <RegisterEmail />}

      {/* 다음 단계 버튼 */}
      {/* TODO: 인증 완료 시에만 활성화 */}
      <div className='fixed bottom-0 left-0 flex w-full flex-col items-center gap-[20px]'>
        <StepIndicator step={step} />
        <div className='flex w-4xl items-center justify-center rounded-t-[20px] p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
          <button
            onClick={() => setStep((prev) => prev + 1)}
            className='w-full border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
          >
            다음 단계로
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignUpForm
