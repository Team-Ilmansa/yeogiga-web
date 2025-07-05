import regularSignInApi from '@/apis/authentication/regularSignInApi'
import { useForm } from 'react-hook-form'
import SignInButton from './SignInButton'
import useAuth from '@/hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'
import logo from '@/assets/sign-in/logo.png'

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
    <div className='flex h-screen w-full flex-col items-center pt-20'>
      <img src={logo} alt='여기가 로고' className='mb-20 h-auto w-60' />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='mb-20 flex w-full flex-col gap-10'
      >
        <div className='flex w-full flex-col gap-2'>
          <label className='text-2xl'>아이디</label>
          <input
            {...register('username', { required: true })}
            placeholder='아이디를 입력해주세요'
            type='text'
            className='border-none bg-gray-100 p-[30px] text-2xl'
          />
        </div>
        <div className='flex w-full flex-col gap-2'>
          <label className='text-2xl'>비밀번호</label>
          <input
            {...register('password', { required: true })}
            placeholder='비밀번호를 입력해주세요'
            type='password'
            className='border-none bg-gray-100 p-[30px] text-2xl'
          />
        </div>
        <button
          type='submit'
          className='absolute bottom-0 mb-6 w-full border-none bg-[#8287FF] p-[30px] text-2xl text-white'
        >
          로그인하기
        </button>
      </form>
      <div className='mb-30 text-lg text-[#7D7D7D]'>
        <Link>아이디 찾기</Link>&nbsp;|&nbsp;<Link>비밀번호 찾기</Link>
        &nbsp;|&nbsp;<Link>회원가입하기</Link>
      </div>

      <div className='flex flex-col gap-2 text-lg text-[#7D7D7D]'>
        SNS계정으로 간편로그인하기
        <div className='flex items-center gap-5'>
          <SignInButton.KakaoLogin />
          <SignInButton.NaverLogin />
        </div>
      </div>
    </div>
  )
}

export default SignInForm
