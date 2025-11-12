import findIdApi from '@/apis/authentication/findIdApi'
import GoBack from '@/assets/sign-up/GoBack'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/** 아이디 찾기 페이지 */
const FindId = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  const findIdClick = async (e) => {
    e.preventDefault()
    try {
      const body = { email }
      const response = await findIdApi(body)

      if (response?.code === 200) {
        const username = response.data.username
        navigate('/user/help/id/result', { state: { username } })
      } else {
        alert(response?.message || '아이디를 찾을 수 없습니다.')
      }
    } catch (error) {
      console.error(error)
      alert('아이디 찾기 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className='flex w-full flex-col pt-5'>
      <div>
        <button
          className='text-bold my-5 border-none px-8'
          onClick={() => navigate('/signin')}
        >
          <GoBack />
        </button>
      </div>

      <div className='mb-15 px-10'>
        <div className='text-4xl/[1.4] font-bold text-[var(--Grey-Scale-grey-400)]'>
          아이디 찾기에 사용할
          <br />
          이메일을 입력해주세요
        </div>
        <div className='text-lg/[2] text-[var(--Grey-Scale-grey-300)]'>
          입력하신 이메일로 가입된 아이디를 안내해드릴게요
        </div>
      </div>

      <form
        onSubmit={findIdClick}
        className='flex h-full w-full flex-col items-center px-10'
      >
        <div className='mb-[30px] flex w-full flex-col justify-between gap-2'>
          <label className='text-xl'>이메일</label>
          <input
            placeholder='이메일을 입력해주세요'
            type='email'
            className='border-none bg-gray-100 p-[20px] text-xl'
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className='fixed bottom-0 left-0 flex w-full flex-col items-center gap-[20px]'>
          <div className='flex w-4xl items-center justify-center rounded-t-[20px] p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
            <button
              type='submit'
              className='w-full border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
            >
              아이디 찾기
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default FindId
