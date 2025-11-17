import regularSignInApi from '@/apis/authentication/regularSignInApi'
import { useForm } from 'react-hook-form'
import SignInButton from './SignInButton'
import useAuth from '@/hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'
import logo from '@/assets/sign-in/logo.png'

const SignInForm = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  /** 입력 관리를 위한 useForm 적용 */
  const { register, handleSubmit } = useForm()

  /** 양식 제출 시 실행 할 함수 */
  const onSubmit = async (data) => {
    /** Request Body 양식에 맞게 변경 */
    const body = {
      username: data.username,
      password: data.password,
    }

    /** 일반 로그인 API 호출 */
    try {
      const result = await regularSignInApi(body)
      login({ token: result.data.accessToken })
      navigate('/')
    } catch (err) {
      const errRes = err.response?.data
      /**탈퇴 계정 로그인 시 복구 페이지로 이동 */
      if (errRes?.data?.userId && errRes?.data?.deletionExpiration) {
        alert('탈퇴된 계정입니다. 계정 복구 페이지로 이동합니다.')
        navigate('/restore/account', {
          state: {
            userId: errRes.data.userId,
            deletionDate: errRes.data.deletionExpiration,
            nickname: errRes.data.nickname,
            imageUrl: errRes.data.imageUrl,
          },
        })
      } else {
        alert(`로그인 실패: ${errRes?.message || err.message}`)
        console.error('로그인 에러: ', err)
      }
    }
  }

  return (
    <div className='flex w-full flex-col items-center pt-20'>
      {/* 상단 로고 */}
      <img src={logo} alt='여기가 로고' className='mb-20 h-auto w-60' />

      {/* 로그인 Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex h-full w-full flex-col items-center justify-between'
      >
        <div className='mb-[10px] flex w-full flex-col gap-2 px-10'>
          {/* 아이디 Input */}
          <label className='text-xl'>아이디</label>
          <input
            {...register('username', { required: true })}
            placeholder='아이디를 입력해주세요'
            type='text'
            autoComplete='username'
            className='mb-[20px] border-none bg-gray-100 p-[20px] text-xl'
          />

          {/* 비밀번호 Input */}
          <label className='text-xl'>비밀번호</label>
          <input
            {...register('password', { required: true })}
            placeholder='비밀번호를 입력해주세요'
            type='password'
            autoComplete='current-password'
            className='border-none bg-gray-100 p-[20px] text-xl'
          />

          {/* 각종 버튼 */}
          <div className='mx-auto my-[50px] text-lg text-[var(--Grey-Scale-grey-300)]'>
            <Link to={'/user/help/id'}>아이디 찾기</Link>&nbsp;|&nbsp;
            <Link to={'/user/help/pw'}>비밀번호 찾기</Link>
            &nbsp;|&nbsp;<Link to={'/signup'}>회원가입하기</Link>
          </div>
        </div>

        <div className='flex w-full flex-col items-center gap-[20px]'>
          {/* SNS 로그인 */}
          <div className='mb-[20px] flex flex-col gap-2 text-lg text-[var(--Grey-Scale-grey-300)]'>
            SNS계정으로 간편로그인하기
            <div className='flex items-center justify-center gap-5'>
              <SignInButton.KakaoLogin />
              <SignInButton.NaverLogin />
            </div>
          </div>

          {/* 일반 로그인 버튼 */}
          <div className='flex w-full items-center justify-center rounded-t-[20px] p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
            <button
              type='submit'
              className='w-full border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
            >
              로그인하기
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SignInForm
