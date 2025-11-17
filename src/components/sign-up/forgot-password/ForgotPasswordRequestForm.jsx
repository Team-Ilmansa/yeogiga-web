import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import RequestResetPasswordApi from '@/apis/authentication/RequestResetPasswordApi'
import GoBack from '@/assets/sign-up/GoBack'
import { useNavigate } from 'react-router-dom'

/**비밀번호 초기화 링크 메일 전송 화면*/
const ForgotPasswordRequestForm = () => {
  const { register, watch, getValues } = useForm()
  const navigate = useNavigate()

  const email = watch('email') || ''
  const username = watch('username') || ''

  const [sending, setSending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')

  /** 이메일 형식 검사 */
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isFormValid = isValidEmail && username.trim().length > 0

  useEffect(() => {
    setErrorMessage('')
    setInfoMessage('')
  }, [email, username])

  const handleSendLink = async () => {
    const { email, username } = getValues()
    if (!email || !username || !isValidEmail) return

    setSending(true)
    setErrorMessage('')
    setInfoMessage('비밀번호 재설정 링크를 전송 중이에요...')

    try {
      await RequestResetPasswordApi({ email, username })
      setInfoMessage(
        '입력하신 이메일로 비밀번호 재설정 링크를 전송했어요. 3분 안에 확인해주세요.',
      )
    } catch (err) {
      if (err.code === 'G002') {
        setErrorMessage('아이디는 필수 입력값입니다.')
        setInfoMessage('')
        return
      }

      setErrorMessage(
        err.message || '비밀번호 재설정 링크 전송 중 오류가 발생했어요.',
      )
      setInfoMessage('')
    } finally {
      setSending(false)
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
      <div className='mb-15 px-10'>
        <div className='text-4xl/[1.4] font-bold text-[var(--Grey-Scale-grey-400)]'>
          비밀번호를
          <br />
          재설정해드릴게요
        </div>
        <div className='mt-3 text-lg/[2] text-[var(--Grey-Scale-grey-300)]'>
          가입하신 이메일과 아이디를 입력하면
          <br />
          비밀번호 재설정 링크를 보내드릴게요
        </div>
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className='flex h-full w-full flex-col items-center px-10'
      >
        {/* 이메일 입력 */}
        <div className='mb-[30px] flex w-full flex-col gap-2'>
          <label className='text-xl'>이메일</label>
          <input
            {...register('email', { required: true })}
            placeholder='가입하신 이메일을 입력해주세요'
            type='email'
            className='border-none bg-gray-100 p-[20px] text-xl'
          />
        </div>

        {/** 아이디 입력 + 버튼 */}
        <div className='mb-[16px] flex w-full flex-col gap-2'>
          <label className='text-xl'>아이디</label>
          <div className='relative flex w-full flex-col'>
            <input
              {...register('username', { required: true })}
              placeholder='가입하신 아이디를 입력해주세요'
              type='text'
              className='border-none bg-gray-100 p-[20px] text-xl'
            />
            <button
              type='button'
              onClick={handleSendLink}
              disabled={!isFormValid || sending}
              className={`absolute top-1/2 right-5 -translate-y-1/2 rounded-[18px] border-none px-[11px] py-[4px] text-lg text-[var(--Grey-Scale-grey-00)] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.10)] transition-colors ${
                !isFormValid || sending
                  ? 'cursor-not-allowed bg-[var(--Grey-Scale-grey-200)]'
                  : 'cursor-pointer bg-[var(--Blue-Scale-blue-500)]'
              }`}
            >
              {sending ? '전송 중' : '링크 전송'}
            </button>
          </div>
        </div>

        {/** 안내/에러 메시지 */}
        <div className='mt-1 h-[20px] w-full'>
          {errorMessage ? (
            <p className='text-right text-sm text-red-500'>{errorMessage}</p>
          ) : infoMessage ? (
            <p className='text-right text-sm text-[var(--Blue-Scale-blue-500)]'>
              {infoMessage}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  )
}

export default ForgotPasswordRequestForm
