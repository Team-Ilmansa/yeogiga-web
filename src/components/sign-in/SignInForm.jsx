import regularSignInApi from '@/apis/authentication/regularSignInApi'
import { useForm } from 'react-hook-form'
import SignInButton from './SignInButton'

const SignInForm = () => {
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
      alert('로그인에 성공했습니다!')
      console.log('로그인 성공: ', result)
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
      {/**로그인 버튼 컴포넌트 내에 카카오로그인 컴포넌트 호출 */}
      <SignInButton.KakaoLogin />
    </fieldset>
  )
}

export default SignInForm
