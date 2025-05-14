import userInfoApi from '@/apis/users/userInfoApi'
import useAuth from '@/hooks/useAuth'
import React, { useEffect, useState } from 'react'

const MyPage = () => {
  const [userInfo, setUserInfo] = useState([])

  /**회원 정보 조회 API 호출 */
  const fetchUserInfo = async () => {
    try {
      const result = await userInfoApi()
      console.log('회원 정보 조회 성공: ', result)

      setUserInfo(result.data)
    } catch (err) {
      console.error('회원 정보 조회 에러: ', err)
    }
  }

  useEffect(() => {
    fetchUserInfo()
  }, [])

  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center'>
      <p>닉네임: {userInfo.nickname}</p>
      <p>이메일: {userInfo.email}</p>
    </div>
  )
}

export default MyPage
