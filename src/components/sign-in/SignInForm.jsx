import regularSignInApi from '@/apis/authentication/regularSignInApi'
import { useForm } from 'react-hook-form'
import SignInButton from './SignInButton'
import useAuth from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const SignInForm = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  /** 양식 제출 시 일반 로그인 API 호출 */
  const onSubmit = async (data) => {
    const { username, password } = data

    /** Request Body 양식에 맞게 변경 */
    const body = {
      username: data.username,
      password: data.password,
    }

    try {
      const result = await regularSignInApi(body)
      login({ token: result.data.accessToken })
      navigate('/')
    } catch (err) {
      alert(`로그인 실패: ${err.message}`)
      console.error('로그인 에러: ', err)
    }
  }

  return (
    <fieldset className='border p-5'>
      <legend className='p-2'>로그인</legend>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-2 p-5'
      >
        <input {...register('username', { required: true })} placeholder='ID' />
        <input
          {...register('password', { required: true })}
          placeholder='Password'
          type='password'
        />
        <button type='submit' className='rounded-2xl border p-2'>
          일반 로그인
        </button>
      </form>
      <SignInButton.KakaoLogin />
      <SignInButton.NaverLogin />
    </fieldset>
  )
}

export default SignInForm
