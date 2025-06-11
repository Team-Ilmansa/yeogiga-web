import nicknameDupCheckApi from '@/apis/authentication/nicknameDupCheckApi'
import signUpApi from '@/apis/authentication/signUpApi'
import usernameDupCheckApi from '@/apis/authentication/usernameDupCheckApi'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  /** 양식 제출 시 회원가입 API 호출 */
  const onSubmit = async (data) => {
    const { emailId, domain, customDomain } = data
    const fullEmail =
      domain === '직접 작성'
        ? `${emailId}@${customDomain}`
        : `${emailId}@${domain}`

    /** Request Body 양식에 맞게 변경 */
    const body = {
      username: data.username,
      password: data.password,
      email: fullEmail,
      nickname: data.nickname,
    }

    try {
      const result = await signUpApi(body)
      alert('회원가입이 완료되었습니다!')
    } catch (err) {
      alert(`회원가입 실패: ${err.message}`)
      console.error('회원가입 에러:', err)
    }
  }

  const selectedDomain = watch('domain')
  const username = watch('username')
  const nickname = watch('nickname')

  /**버튼 클릭 시 아이디 중복 확인 API 호출 */
  const handleDupCheckUsername = async () => {
    try {
      const result = await usernameDupCheckApi(username)
      alert(result.message)
    } catch (err) {
      alert(err.message)
      console.error('아이디 중복 확인 실패:', err)
    }
  }

  /**버튼 클릭 시 닉네임 중복 확인 API 호출 */
  const handleDupCheckNickname = async () => {
    try {
      const result = await nicknameDupCheckApi(nickname)
      alert(result.message)
    } catch (err) {
      alert(err.message)
      console.error(`닉네임 중복 확인 에러:`, err)
    }
  }

  return (
    <fieldset className='flex flex-col border p-5'>
      <legend className='p-2'>회원가입</legend>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-2 p-5'
      >
        <div className='flex items-center gap-2'>
          <input
            {...register('username', { required: true })}
            placeholder='ID'
            className='flex-1'
          />
          <button onClick={handleDupCheckUsername}>중복 확인</button>
        </div>
        <input
          {...register('password', { required: true })}
          placeholder='Password'
          type='password'
        />
        <div className='flex items-center gap-2'>
          <input
            {...register('emailId', { required: true })}
            placeholder='이메일 아이디'
          />
          <span>@</span>
          <input
            {...register('customDomain')}
            placeholder='도메인 입력'
            disabled={selectedDomain !== '직접 작성'}
          />
          <select
            {...register('domain')}
            defaultValue='직접 작성'
            className='border p-2'
          >
            <option value='직접 작성'>직접 작성</option>
            <option value='naver.com'>naver.com</option>
            <option value='gmail.com'>gmail.com</option>
            <option value='daum.net'>daum.net</option>
          </select>
        </div>
        <div className='flex items-center gap-2'>
          <input
            {...register('nickname', { required: true })}
            placeholder='닉네임'
            className='flex-1'
          />
          <button onClick={handleDupCheckNickname}>중복 확인</button>
        </div>
      </form>
      <button type='submit' className='flex-1'>
        회원 가입
      </button>
    </fieldset>
  )
}

export default SignUpForm
