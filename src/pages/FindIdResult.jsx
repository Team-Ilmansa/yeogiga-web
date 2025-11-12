import GoBack from '@/assets/sign-up/GoBack'
import { Check } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

/** 아이디 찾기 결과 페이지 */
const FindIdResult = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const username = location.state.username

  return (
    <div className='flex w-full flex-col pt-5'>
      {/* 뒤로 가기 버튼 */}
      <div>
        <button
          className='text-bold my-5 border-none px-8'
          onClick={() => navigate(-1)}
        >
          <GoBack />
        </button>
      </div>

      <div className='mt-[280px] flex h-screen flex-col items-center justify-start'>
        <Check className='mb-6 h-15 w-15 text-[var(--Blue-Scale-blue-500)]' />

        {username ? (
          <h2 className='mb-6 text-center text-3xl leading-relaxed font-bold'>
            가입하신 아이디는
            <br />
            <span className='font-medium text-[var(--Blue-Scale-blue-500)]'>
              {username}
            </span>{' '}
            입니다.
          </h2>
        ) : (
          <p className='mb-8 text-center text-xl text-red-500'>
            아이디 정보를 불러올 수 없습니다.
          </p>
        )}
      </div>
      <div className='fixed bottom-0 left-0 flex w-full flex-col items-center gap-[20px]'>
        <div className='flex w-4xl items-center justify-center rounded-t-[20px] p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
          <button
            onClick={() => navigate('/signin')}
            className='w-full border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
          >
            로그인 화면으로 이동하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default FindIdResult
