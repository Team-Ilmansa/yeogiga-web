import restoreAccountApi from '@/apis/authentication/restoreAccountApi'
import GoBack from '@/assets/sign-up/GoBack'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import userInfoApi from '@/apis/users/userInfoApi'
import useAuth from '@/hooks/useAuth'
import FixedActionBar from '@/components/common/FixedActionBar'

const RestoreAccount = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { userId, deletionDate } = location.state || {}
  // TODO: fetchUserInfo를 위함. 로직 삭제 시 삭제 예정
  const [userInfo, setUserInfo] = useState(null)

  /**계정 복구 API 호출 */
  const restoreAccount = async () => {
    try {
      await restoreAccountApi(userId)
      alert('계정이 복구되었습니다. 로그인 페이지로 이동합니다.')
      navigate('/signin')
    } catch (err) {
      alert(err.response?.data?.message || '계정 복구에 실패했습니다.')
    }
  }
  /** TODO: 사용자 프로필/이름 불러오기 위한 회원 정보 조회 API 호출 */
  const fetchUserInfo = async () => {
    try {
      const result = await userInfoApi()
      setUserInfo(data)
      console(result.data)
    } catch (err) {
      console.error('회원 정보 조회 에러: ', err)
    }
  }

  return (
    <div className='flex w-full flex-col pt-5'>
      {/** 뒤로 가기 버튼 */}
      <div>
        <button
          className='text-bold my-5 border-none px-8'
          onClick={() => navigate('/')}
        >
          <GoBack />
        </button>
      </div>
      <div className='pt-10 pb-50 pl-10'>
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
            <strong>{new Date(deletionDate).toLocaleString()}</strong> 이후에는
            복구가 불가능합니다.
          </p>
        </div>
        {/* TODO: 디자인/서버 수정 후 사용자 이미지 */}
        {isAuthReady && isAuthenticated && userInfo?.imgUrl && (
          <div className='mb-4 flex justify-center'>
            <img
              src={userInfo.imgUrl}
              alt='사용자 프로필'
              className='h-20 w-20 rounded-full border object-cover'
            />
          </div>
        )}

        {/* TODO: 디자인/서버 수정 후 사용자 이름 */}
        {isAuthReady && isAuthenticated ? (
          userInfo?.nickname ? (
            <h1 className='mb-6 text-xl font-bold'>{userInfo.nickname}님</h1>
          ) : (
            <p className='mb-6 text-sm text-gray-400'>
              사용자 정보를 불러오는 중…
            </p>
          )
        ) : (
          <p className='mb-6 text-sm text-gray-400'>로그인 준비 중…</p>
        )}
      </div>
      {/* 계정 복구하기 버튼 */}
      <FixedActionBar>
        <div className='fixed bottom-0 left-0 flex w-full justify-center'>
          <div className='flex w-4xl items-center justify-center rounded-t-[20px] bg-white p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
            <button
              onClick={restoreAccount}
              className='w-full border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
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
