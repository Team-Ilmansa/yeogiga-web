import usernameDupCheckApi from '@/apis/authentication/usernameDupCheckApi'
import Check from '@/assets/sign-up/Check'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

/**비밀번호 등록 화면 */
const RegisterPassword = ({ setIsPasswordVerified }) => {
  /**아이디 메세지 */
  const [usernameError, setUsernameError] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')

  /**useForm */
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  /**아이디 입력값 검사 */
  const username = watch('username')

  /**아이디 값 변경 시 메세지 초기화 */
  useEffect(() => {
    if (usernameMessage || usernameError) {
      setUsernameMessage('')
      setUsernameError('')
    }
  }, [username])

  /**아이디 중복 확인 API 호출 */
  const handleDupCheckUsername = async () => {
    try {
      const result = await usernameDupCheckApi(username)
      setUsernameMessage('사용 가능한 아이디에요')
    } catch (err) {
      setUsernameError('이미 사용중인 아이디에요')
    }
  }

  /**조건별 비밀번호 입력값 검사 */
  const password = watch('password') || ''
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-\\[\]]/.test(password)
  const hasLength = password.length >= 8 && password.length <= 20

  /**조건별 색상 설정 함수 */
  const getColor = (condition) =>
    condition ? 'var(--Blue-Scale-blue-500)' : 'var(--Grey-Scale-grey-200)'

  /**확인 비밀번호 입력값 검사 */
  const confirmPassword = watch('confirmPassword') || ''
  const isPasswordMatch =
    password && confirmPassword && password === confirmPassword

  /**전체 아이디, 비밀번호 검사 통과 여부 */
  const isPasswordValid = hasLetter && hasNumber && hasSpecial && hasLength
  const isFormValid = usernameMessage && isPasswordValid && isPasswordMatch

  /**아이디, 비밀번호 검사 전체 통과 시 버튼 활성화 */
  useEffect(() => {
    setIsPasswordVerified(isFormValid)
  }, [isFormValid])

  return (
    <div>
      <div className='mb-15 px-10'>
        {/* 아이디, 비밀번호 등록 화면 상단 문구 */}
        <div className='text-4xl/[1.4] font-bold text-[var(--Grey-Scale-grey-400)]'>
          아이디와 비밀번호를
          <br />
          설정해주세요
        </div>
        <div className='text-lg/[2] text-[var(--Grey-Scale-grey-300)]'>
          영문, 숫자, 특수기호 포함 8~20자이내로 설정할 수 있어요
        </div>
      </div>

      {/* 아이디, 비밀번호 설정 Form */}
      <form className='flex h-full w-full flex-col gap-2 px-10'>
        <div className='mb-[30px] flex w-full flex-col justify-between gap-2'>
          {/* 아이디 Input */}
          <label className='text-xl'>아이디</label>
          <div className='relative flex w-full flex-col'>
            <input
              {...register('username')}
              placeholder='아이디를 입력해주세요'
              type='text'
              className='border-none bg-gray-100 p-[20px] text-xl'
            />
            <button
              type='button'
              disabled={!username}
              onClick={handleDupCheckUsername}
              className={`absolute top-1/2 right-5 -translate-y-1/2 rounded-[18px] border-none px-[11px] py-[4px] text-lg text-[var(--Grey-Scale-grey-00)] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.10)] transition-colors ${
                username
                  ? 'cursor-pointer bg-[var(--Blue-Scale-blue-500)]'
                  : 'cursor-not-allowed bg-[var(--Grey-Scale-grey-200)]'
              }`}
            >
              중복확인
            </button>
          </div>

          {/* 아이디 중복확인 메세지 */}
          <div className='h-[20px]'>
            {usernameError ? (
              <p className='text-right text-sm text-red-500'>
                이미 사용중인 아이디에요
              </p>
            ) : (
              usernameMessage && (
                <p className='text-right text-sm text-[var(--Blue-Scale-blue-500)]'>
                  사용 가능한 아이디에요
                </p>
              )
            )}
          </div>
        </div>

        {/* 비밀번호 Input */}
        <label className='text-xl'>비밀번호</label>
        <input
          {...register('password')}
          placeholder='비밀번호를 입력해주세요'
          type='password'
          className='border-none bg-gray-100 p-[20px] text-xl'
        />

        {/* 조건 검사 메세지 */}
        <div className='flex h-[20px] justify-end gap-2'>
          <div
            className='flex items-center gap-1 text-sm'
            style={{ color: getColor(hasLetter) }}
          >
            영문
            <Check color={getColor(hasLetter)} />
          </div>
          <div
            className='flex items-center gap-1 text-sm'
            style={{ color: getColor(hasNumber) }}
          >
            숫자
            <Check color={getColor(hasNumber)} />
          </div>
          <div
            className='flex items-center gap-1 text-sm'
            style={{ color: getColor(hasSpecial) }}
          >
            특수기호
            <Check color={getColor(hasSpecial)} />
          </div>
          <div
            className='flex items-center gap-1 text-sm'
            style={{ color: getColor(hasLength) }}
          >
            글자수
            <Check color={getColor(hasLength)} />
          </div>
        </div>

        {/* 비밀번호 확인 Input */}
        <label className='text-xl'>비밀번호 확인</label>
        <input
          {...register('confirmPassword')}
          placeholder='비밀번호를 입력해주세요'
          type='password'
          className='border-none bg-gray-100 p-[20px] text-xl'
        />

        {/* 비밀번호 일치 메시지 */}
        <div className='h-[20px] text-right text-sm'>
          {confirmPassword.length > 0 && (
            <p
              className={
                isPasswordMatch
                  ? 'text-[var(--Blue-Scale-blue-500)]'
                  : 'text-red-500'
              }
            >
              {isPasswordMatch
                ? '비밀번호가 일치해요'
                : '비밀번호가 일치하지 않아요'}
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default RegisterPassword
