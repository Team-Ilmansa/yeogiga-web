import emailRequestApi from '@/apis/authentication/emailRequestApi'
import verifyCodeApi from '@/apis/authentication/verifyCodeApi'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

/**이메일 인증 화면 */
const RegisterEmail = ({ isEmailVerified, setIsEmailVerified, setEmail }) => {
  /**최초 전송 여부 */
  const [hasRequested, setHasRequested] = useState(false)
  /**이메일 에러 메시지 */
  const [emailError, setEmailError] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [checkingEmail, setCheckingEmail] = useState(false)

  /**useForm */
  const { register, handleSubmit, watch } = useForm()

  /**이메일 형식 검사 */
  const email = watch('email') || ''
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  /** 이메일 변경될 때마다 중복 체크 */
  useEffect(() => {
    if (!email) {
      setEmailError('')
      setEmailMessage('')
      setHasRequested(false)
      return
    }
    if (!isValidEmail) {
      setEmailError('')
      setEmailMessage('')
      return
    }

    setCheckingEmail(true)
    setEmailError('')
    setEmailMessage('이메일 확인 중...')

    const timer = setTimeout(async () => {
      try {
        await emailRequestApi({ email })
        setEmailMessage('가입 가능한 이메일이에요')
      } catch (err) {
        // 이미 가입된 이메일
        if (err.code === 'A013') {
          setEmailError('이미 가입된 이메일이에요')
          setEmailMessage('')
        } else {
          setEmailError('이메일 확인 중 오류가 발생했어요')
          setEmailMessage('')
        }
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [email, isValidEmail])

  /**코드 길이 검사 */
  const code = watch('code')
  const isCodeComplete = code?.length === 6

  /**이메일 인증 번호 발송 요청 */
  const handleRequestCode = async (data) => {
    const body = { email: data.email }

    try {
      await emailRequestApi(body)
      setHasRequested(true)
    } catch (err) {
      if (err.code === 'A013') {
        setEmailError('이미 가입된 이메일이에요')
        return
      }

      if (err.code === 'A014' || err.message?.includes('시도 횟수를 초과')) {
        setEmailError(
          '이메일 인증 시도 횟수를 초과하였습니다. 잠시 후 시도해주세요.',
        )
        return
      }

      setEmailError('이메일 인증 중 오류가 발생했어요')
    }
  }

  /**이메일 인증 번호 검증 */
  const handleVerifyCode = async (data) => {
    const body = {
      email: data.email,
      code: data.code,
    }
    try {
      await verifyCodeApi(body)
      setIsEmailVerified(true)
      setEmail(data.email)
    } catch (err) {
      alert(err.message)
    }
  }

  /**버튼 클릭 시 실행할 함수 */
  const onSubmit = (data) => {
    /**확인 버튼을 눌렀을 경우 */
    if (data.code?.length === 6) {
      handleVerifyCode(data)
    } else {
      /**전송 or 재전송 버튼을 눌렀을 경우 */
      handleRequestCode(data)
    }
  }

  return (
    <div>
      <div className='mb-15 px-10'>
        {/* 이메일 인증 화면 상단 문구 */}
        <div className='text-4xl/[1.4] font-bold text-[var(--Grey-Scale-grey-400)]'>
          로그인에 사용할
          <br />
          이메일을 입력해주세요
        </div>
        <div className='text-lg/[2] text-[var(--Grey-Scale-grey-300)]'>
          입력하신 이메일로 회원여부 확인 및 서비스 가입을 도와드릴게요
        </div>
      </div>

      {/* 이메일 인증 Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex h-full w-full flex-col items-center px-10'
      >
        {/* 이메일 Input */}
        <div className='mb-[30px] flex w-full flex-col justify-between gap-2'>
          <label className='text-xl'>이메일</label>
          <input
            {...register('email', { required: true })}
            placeholder='이메일을 입력해주세요'
            type='email'
            className='border-none bg-gray-100 p-[20px] text-xl'
          />
          {/* 안내 메세지 */}
          <div className='h-[20px]'>
            {emailError ? (
              <p className='text-right text-sm text-red-500'>{emailError}</p>
            ) : checkingEmail ? (
              <p className='text-right text-sm text-[var(--Grey-Scale-grey-300)]'>
                이메일 확인 중이에요...
              </p>
            ) : emailMessage ? (
              <p className='text-right text-sm text-[var(--Blue-Scale-blue-500)]'>
                {emailMessage}
              </p>
            ) : null}
          </div>
        </div>

        {/* 이메일 인증 번호 Input */}
        <div className='flex w-full flex-col justify-between gap-2'>
          <label className='text-xl'>이메일 확인</label>
          <div className='relative flex w-full flex-col'>
            <input
              {...register('code')}
              maxLength={6}
              placeholder='인증번호 6자리를 입력해주세요'
              type='text'
              className='border-none bg-gray-100 p-[20px] text-xl'
            />
            <button
              type='submit'
              disabled={!isValidEmail || !!emailError}
              className={`absolute top-1/2 right-5 -translate-y-1/2 rounded-[18px] border-none px-[11px] py-[4px] text-lg text-[var(--Grey-Scale-grey-00)] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.10)] transition-colors ${
                !isValidEmail || !!emailError
                  ? 'cursor-not-allowed bg-[var(--Grey-Scale-grey-200)]'
                  : 'cursor-pointer bg-[var(--Blue-Scale-blue-500)]'
              }`}
            >
              {isCodeComplete ? '확인' : hasRequested ? '재전송' : '전송'}
            </button>
          </div>
          {/* 안내 메세지 */}
          {isEmailVerified && (
            <p className='text-right text-sm text-[var(--Blue-Scale-blue-500)]'>
              이메일 인증에 성공했어요
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default RegisterEmail
