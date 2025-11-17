import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import ResetPasswordApi from '@/apis/authentication/ResetPassWordAPi'
import { useNavigate } from 'react-router-dom'
import GoBack from '@/assets/sign-up/GoBack'

/** 비밀번호 재설정 폼 */
const ResetPasswordForm = ({ code }) => {
  const { register, watch, getValues } = useForm()
  const navigate = useNavigate()

  const email = watch('email') || ''
  const username = watch('username') || ''
  const password = watch('password') || ''
  const passwordConfirm = watch('passwordConfirm') || ''

  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isPasswordValid = password.length >= 8
  const isPasswordMatched = password.length > 0 && password === passwordConfirm

  const isFormValid =
    isValidEmail &&
    username.trim().length > 0 &&
    isPasswordValid &&
    isPasswordMatched &&
    !!code

  useEffect(() => {
    setErrorMessage('')
    setSuccessMessage('')
  }, [email, username, password, passwordConfirm])

  const handleResetPassword = async () => {
    if (!isFormValid) return

    const { email, username, password } = getValues()
    const body = {
      email,
      username,
      code,
      password,
    }

    setSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('비밀번호를 변경 중이에요...')

    try {
      await ResetPasswordApi(body)

      setSuccessMessage('비밀번호가 성공적으로 변경되었어요!')

      setTimeout(() => {
        navigate('/')
      }, 800)
    } catch (err) {
      if (err.code === 'A021') {
        setErrorMessage(
          '비밀번호 초기화 요청 후 3분 이내 재요청은 불가능합니다. 잠시 후 다시 시도해주세요.',
        )
        setSuccessMessage('')
        return
      }

      setErrorMessage(err.message || '비밀번호 변경 중 오류가 발생했어요.')
      setSuccessMessage('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='flex w-full flex-col pt-5'>
      <div>
        <button
          className='text-bold my-5 border-none px-8'
          onClick={() => navigate('/')}
        >
          <GoBack />
        </button>
      </div>

      {/** 안내 문구 */}
      <div className='mb-15 px-10'>
        <div className='text-4xl/[1.4] font-bold text-[var(--Grey-Scale-grey-400)]'>
          새 비밀번호로
          <br />
          변경해주세요
        </div>
        <div className='mt-3 text-lg/[2] text-[var(--Grey-Scale-grey-300)]'>
          이메일로 받은 링크를 통해 접속하셨다면
          <br />
          아래 정보와 새 비밀번호를 입력 후 완료해 주세요
        </div>
      </div>

      {/** 폼 */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className='flex h-full w-full flex-col items-center px-10 pb-[140px]'
      >
        {/** 이메일 */}
        <div className='mb-[20px] flex w-full flex-col gap-2'>
          <label className='text-xl'>이메일</label>
          <input
            {...register('email', { required: true })}
            placeholder='가입하신 이메일을 입력해주세요'
            type='email'
            className='border-none bg-gray-100 p-[20px] text-xl'
          />
        </div>

        {/** 아이디 */}
        <div className='mb-[20px] flex w-full flex-col gap-2'>
          <label className='text-xl'>아이디</label>
          <input
            {...register('username', { required: true })}
            placeholder='가입하신 아이디를 입력해주세요'
            type='text'
            className='border-none bg-gray-100 p-[20px] text-xl'
          />
        </div>

        {/** 새 비밀번호 */}
        <div className='mb-[20px] flex w-full flex-col gap-2'>
          <label className='text-xl'>새 비밀번호</label>
          <input
            {...register('password', { required: true })}
            placeholder='새 비밀번호를 입력해주세요 (8자 이상)'
            type='password'
            className='border-none bg-gray-100 p-[20px] text-xl'
          />
          {!isPasswordValid && password && (
            <p className='text-right text-sm text-red-500'>
              비밀번호는 8자 이상이어야 해요.
            </p>
          )}
        </div>

        {/** 새 비밀번호 확인 */}
        <div className='mb-[24px] flex w-full flex-col gap-2'>
          <label className='text-xl'>새 비밀번호 확인</label>
          <input
            {...register('passwordConfirm', { required: true })}
            placeholder='새 비밀번호를 한 번 더 입력해주세요'
            type='password'
            className='border-none bg-gray-100 p-[20px] text-xl'
          />
          {!isPasswordMatched && passwordConfirm && (
            <p className='text-right text-sm text-red-500'>
              비밀번호가 일치하지 않아요.
            </p>
          )}
        </div>

        {/** 메시지 */}
        <div className='mb-6 h-[20px] w-full'>
          {errorMessage && (
            <p className='text-right text-sm text-red-500'>{errorMessage}</p>
          )}
          {successMessage && (
            <p className='text-right text-sm text-[var(--Blue-Scale-blue-500)]'>
              {successMessage}
            </p>
          )}
        </div>
      </form>

      {/** 하단 버튼 */}
      <div className='fixed bottom-0 left-0 flex w-full flex-col items-center gap-[20px]'>
        <div className='flex w-4xl items-center justify-center rounded-t-[20px] p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
          <button
            type='button'
            onClick={handleResetPassword}
            disabled={!isFormValid || submitting}
            className={`w-full border-none p-[20px] text-2xl text-white transition-colors ${
              !isFormValid || submitting
                ? 'cursor-not-allowed bg-[var(--Grey-Scale-grey-200)]'
                : 'cursor-pointer bg-[var(--Blue-Scale-blue-500)]'
            }`}
          >
            {submitting ? '변경 중...' : '비밀번호 변경 완료'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordForm
