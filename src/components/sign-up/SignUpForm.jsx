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

  /**회원가입 각 단계 */
  const [step, setStep] = useState(1)
  /**이메일 인증 완료 여부 */
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  /**아이디, 비밀번호 유효성 여부 */
  const [isPasswordVerified, setIsPasswordVerified] = useState(false)
  /**닉네임 유효성 여부 */
  const [isNicknameVerified, setIsNicknameVerified] = useState(false)

  /**입력 받은 값 */
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')

  /**뒤로 가기 버튼 */
  const handleBack = () => {
    if (step === 1) {
      navigate(-1)
    } else {
      setStep((prev) => prev - 1)
    }
  }

  /**하단 버튼 */
  const handleStepButton = async () => {
    if (step === 5) {
      navigate('/signin')
    } else if (step == 4) {
      /**4단계에서 가입 완료 버튼 클릭 시 회원가입 API 호출 */
      const body = {
        username: username,
        password: password,
        email: email,
        nickname: nickname,
      }
      try {
        const result = await signUpApi(body)
        setStep((prev) => prev + 1)
      } catch (err) {
        alert(err.message)
      }
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
    3: <TermsAgreement />,
    4: (
      <RegisterNickname
        setIsNicknameVerified={setIsNicknameVerified}
        setNickname={setNickname}
      />
    ),
    5: <SignUpConfirmation nickname={nickname} />,
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
        {step < 5 && <StepIndicator step={step} totalSteps={5} />}
        <div className='flex w-4xl items-center justify-center rounded-t-[20px] p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
          {/* 1, 2단게 인증 완료 시 활성화
          TODO: 나머지 단계에도 적용 */}
          <button
            onClick={handleStepButton}
            disabled={
              (step === 1 && !isEmailVerified) ||
              (step === 2 && !isPasswordVerified) ||
              (step === 4 && !isNicknameVerified)
            }
            className={`w-full border-none p-[20px] text-2xl text-white transition-colors ${
              (step === 1 && !isEmailVerified) ||
              (step === 2 && !isPasswordVerified) ||
              (step === 4 && !isNicknameVerified)
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
