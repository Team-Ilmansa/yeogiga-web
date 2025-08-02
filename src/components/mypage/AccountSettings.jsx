import signOutApi from '@/apis/authentication/signOutApi'
import useAuth from '@/hooks/useAuth'
import React from 'react'

const AccountSettings = () => {
  const { user, logout } = useAuth()
  const style = 'text-lg cursor-pointer'

  /**버튼 클릭 시 로그아웃 */
  const handleSignOut = async () => {
    try {
      const result = await signOutApi()
      logout()
    } catch (error) {
      console.error('로그아웃 중 오류 발생: ', error.message)
    }
  }
  return (
    <>
      <div className={style}>문의하기</div>
      <div onClick={handleSignOut} className={style}>
        로그아웃
      </div>
      <div className={style}>회원탈퇴</div>
    </>
  )
}

export default AccountSettings
