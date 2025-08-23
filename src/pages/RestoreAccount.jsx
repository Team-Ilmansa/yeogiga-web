import restoreAccountApi from '@/apis/authentication/restoreAccountApi'
import GoBack from '@/assets/sign-up/GoBack'
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import FixedActionBar from '@/components/common/FixedActionBar'

const RestoreAccount = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // 로그인 실패 시 navigate로 전달한 값들
  const { userId, deletionDate, nickname, imageUrl } = location.state || {}

  // 필수 값이 없으면 로그인으로 돌려보내기
  useEffect(() => {
    if (!userId) {
      alert('복구 대상 정보가 없습니다. 다시 로그인해 주세요.')
      navigate('/signin', { replace: true })
    }
  }, [userId, navigate])

  /** 계정 복구 API 호출 */
  const restoreAccount = async () => {
    try {
      await restoreAccountApi(userId)
      alert('계정이 복구되었습니다. 로그인 페이지로 이동합니다.')
      navigate('/signin')
    } catch (err) {
      alert(err.message || '계정 복구에 실패했습니다.')
      console.error('[RESTORE][ERR]', err)
    }
  }

  return (
    <div className='flex w-full flex-col pt-5 pb-[120px]'>
      {/** 뒤로 가기 버튼 */}
      <div>
        <button
          className='text-bold my-5 border-none px-8'
          onClick={() => navigate('/')}
        >
          <GoBack />
        </button>
      </div>

      <div className='pt-10 pl-10'>
        <h1 className='text-4xl leading-normal font-bold'>
          계정을
          <br />
          복구하시겠어요?
        </h1>

        <div className='mt-5 text-lg text-gray-400'>
          탈퇴한 계정으로 일주일 이내에 재로그인시 계정 복구가 가능합니다.
          <br />
          복구를 원하지 않으시다면 뒤로가기를 눌러주세요.
          <p className='mt-1 text-[#FF0000]'>
            <strong>
              {deletionDate ? new Date(deletionDate).toLocaleString() : '-'}
            </strong>{' '}
            이후에는 복구가 불가능합니다.
          </p>
        </div>

        {/** 탈퇴한 계정 프로필 이미지 */}
        <div className='mt-30 flex flex-col items-center'>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt='사용자 프로필'
              className='h-60 w-60 rounded-full border-none object-cover'
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <p className='text-sm text-gray-400'>
              프로필 이미지를 불러오는 중…
            </p>
          )}
          {/** 탈퇴한 계정 닉네임 */}
          {nickname ? (
            <h1 className='mt-6'>
              <span className='text-3xl font-bold'>{nickname} </span>
              <span className='mt-4 text-lg'>님</span>
            </h1>
          ) : (
            <p className='mt-4 text-sm text-gray-400'>
              사용자 이름을 불러오는 중…
            </p>
          )}
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <FixedActionBar>
        <div className='flex w-full justify-center'>
          <div className='flex w-4xl items-center justify-center rounded-t-[20px] bg-white p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
            <button
              onClick={restoreAccount}
              className='w-full border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
              style={{
                paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
              }}
            >
              계정 복구하기
            </button>
          </div>
        </div>
      </FixedActionBar>
    </div>
  )
}

export default RestoreAccount
