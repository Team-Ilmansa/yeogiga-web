import GoBack from '@/assets/sign-up/GoBack'
import RegisterEmail from './RegisterEmail'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StepIndicator from './StepIndicator'
import RegisterPassword from './RegisterPassword'
import TermsAgreement from './TermsAgreement'
import RegisterNickname from './RegisterNickname'
import SignUpConfirmation from './SignUpConfirmation'
import signUpApi from '@/apis/authentication/signUpApi'

/**회원가입 양식 */
const SignUpForm = () => {
  const navigate = useNavigate()

  /** 각 단계 상태 */
  const [step, setStep] = useState(1)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [isPasswordVerified, setIsPasswordVerified] = useState(false)
  const [isNicknameVerified, setIsNicknameVerified] = useState(false)

  const [isTermsAgreed, setIsTermsAgreed] = useState(false)

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')

  /** 뒤로 가기 */
  const handleBack = () => {
    if (step === 1) navigate(-1)
    else setStep((prev) => prev - 1)
  }

  const handleStepButton = async () => {
    if (step === 5) {
      navigate('/signin')
      return
    }

    if (step === 4) {
      const body = { username, password, email, nickname }
      try {
        await signUpApi(body)
        setStep(5)
      } catch (err) {
        alert(err.message)
      }
      return
    }

    setStep((prev) => prev + 1)
  }

  /** 단계별 화면 */
  const stepComponentMap = {
    1: (
      <RegisterEmail
        isEmailVerified={isEmailVerified}
        setIsEmailVerified={setIsEmailVerified}
        setEmail={setEmail}
      />
    ),
    2: (
      <RegisterPassword
        setIsPasswordVerified={setIsPasswordVerified}
        setUsername={setUsername}
        setPassword={setPassword}
      />
    ),
    3: (
      <TermsAgreement
        isAgreed={isTermsAgreed}
        onChangeAgree={setIsTermsAgreed}
      />
    ),
    4: (
      <RegisterNickname
        setIsNicknameVerified={setIsNicknameVerified}
        setNickname={setNickname}
      />
    ),
    5: <SignUpConfirmation nickname={nickname} />,
  }

  /** 버튼 비활성 조건 */
  const isDisabled =
    (step === 1 && !isEmailVerified) ||
    (step === 2 && !isPasswordVerified) ||
    (step === 3 && !isTermsAgreed) ||
    (step === 4 && !isNicknameVerified)

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
        {step < 5 && <StepIndicator step={step} totalSteps={4} />}

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
            {step === 5 ? '확인' : step === 4 ? '가입 완료' : '다음 단계로'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignUpForm
