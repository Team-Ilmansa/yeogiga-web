import GoBack from '@/assets/sign-up/GoBack'
import RegisterEmail from './RegisterEmail'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StepIndicator from './StepIndicator'
import RegisterPassword from './RegisterPassword'
import TermsAgreement from './TermsAgreement'
import RegisterNickname from './RegisterNickname'
import SignUpConfirmation from './SignUpConfirmation'

/**회원가입 양식 */
const SignUpForm = () => {
  const navigate = useNavigate()

  /**회원가입 각 단계 */
  const [step, setStep] = useState(1)
  /**이메일 인증 완료 여부 */
  const [isEmailVerified, setIsEmailVerified] = useState(false)

  /**뒤로 가기 버튼 */
  const handleBack = () => {
    if (step === 1) {
      navigate(-1)
    } else {
      setStep((prev) => prev - 1)
    }
  }

  /**하단 버튼 */
  const handleStepButton = () => {
    if (step === 5) {
      navigate('/signin')
    } else {
      setStep((prev) => prev + 1)
    }
  }

  /**단계 별 컴포넌트 설정 */
  const stepComponentMap = {
    1: (
      <RegisterEmail
        isEmailVerified={isEmailVerified}
        setIsEmailVerified={setIsEmailVerified}
      />
    ),
    2: <RegisterPassword />,
    3: <TermsAgreement />,
    4: <RegisterNickname />,
    5: <SignUpConfirmation />,
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

      {/* 스텝에 따른 컴포넌트 출력 */}
      {stepComponentMap[step]}

      {/* 다음 단계 버튼 */}
      <div className='fixed bottom-0 left-0 flex w-full flex-col items-center gap-[20px]'>
        {step < 5 && <StepIndicator step={step} />}
        <div className='flex w-4xl items-center justify-center rounded-t-[20px] p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
          {/* 이메일 인증 완료 시 활성화
          TODO: 나머지 단계에도 적용 */}
          <button
            onClick={handleStepButton}
            disabled={step === 1 && !isEmailVerified}
            className={`w-full border-none p-[20px] text-2xl text-white transition-opacity ${
              step === 1 && !isEmailVerified
                ? 'cursor-not-allowed bg-[var(--Grey-Scale-grey-200)]'
                : 'cursor-pointer bg-[var(--Blue-Scale-blue-500)]'
            }`}
          >
            {step === 5 ? '확인' : step === 4 ? '가입 완료' : '다음 단계로'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignUpForm
