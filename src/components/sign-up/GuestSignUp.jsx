import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GoBack from '@/assets/sign-up/GoBack'
import StepIndicator from './StepIndicator'
import TermsAgreement from './TermsAgreement'
import RegisterNickname from './RegisterNickname'
import SignUpConfirmation from './SignUpConfirmation'
import putGuestApi from '@/apis/authentication/putGuestApi'

/** 게스트 회원가입 (이메일/비밀번호 단계 제외) */
const GuestSignUp = () => {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)

  /** 닉네임 유효성 여부 */
  const [isNicknameVerified, setIsNicknameVerified] = useState(false)
  const [isTermsAgreed, setIsTermsAgreed] = useState(false)

  /** 입력값 */
  const [nickname, setNickname] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleBack = () => {
    if (step === 1) navigate(-1)
    else setStep((prev) => prev - 1)
  }

  /** 다음 단계 버튼 */
  const handleStepButton = async () => {
    if (step === 3) {
      navigate('/signin')
      return
    }

    if (step === 2) {
      if (isSubmitting) return
      try {
        setIsSubmitting(true)
        await putGuestApi({ nickname })
        setStep(3)
      } catch (err) {
        alert(
          err?.response?.data?.message ||
            err.message ||
            '게스트 가입에 실패했습니다.',
        )
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    setStep((prev) => prev + 1)
  }

  /** 단계별 컴포넌트 */
  const stepComponentMap = {
    1: (
      <TermsAgreement
        isAgreed={isTermsAgreed}
        onChangeAgree={setIsTermsAgreed}
      />
    ),
    2: (
      <RegisterNickname
        setIsNicknameVerified={setIsNicknameVerified}
        setNickname={setNickname}
      />
    ),
    3: <SignUpConfirmation nickname={nickname} />,
  }

  const isDisabled =
    (step === 1 && !isTermsAgreed) || (step === 2 && !isNicknameVerified)

  return (
    <div className='flex w-full flex-col pt-5'>
      <div>
        <button
          className='text-bold my-5 border-none px-8'
          onClick={handleBack}
        >
          <GoBack />
        </button>
      </div>

      {stepComponentMap[step]}

      <div className='fixed bottom-0 left-0 flex w-full flex-col items-center gap-[20px]'>
        {step < 3 && <StepIndicator step={step} totalSteps={3} />}

        <div className='flex w-4xl items-center justify-center rounded-t-[20px] p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
          <button
            onClick={handleStepButton}
            disabled={isDisabled}
            className={`w-full border-none p-[20px] text-2xl text-white transition-colors ${
              isDisabled
                ? 'cursor-not-allowed bg-[var(--Grey-Scale-grey-200)]'
                : 'cursor-pointer bg-[var(--Blue-Scale-blue-500)]'
            }`}
          >
            {step === 3 ? '확인' : step === 2 ? '가입 완료' : '다음 단계로'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default GuestSignUp
