import signOutApi from '@/apis/authentication/signOutApi'
import deleteUserApi from '@/apis/users/deleteUserApi'
import useAuth from '@/hooks/useAuth'
import { useState } from 'react'
import DeleteTripModal from './modal/DeleteTripModal'

const AccountSettings = () => {
  const { logout } = useAuth()
  const style = 'text-lg cursor-pointer'

  /**회원탈퇴 모달창 토글 */
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false)

  /**버튼 클릭 시 로그아웃 */
  const handleSignOut = async () => {
    try {
      await signOutApi()
      logout()
    } catch (error) {
      console.error('로그아웃 중 오류 발생: ', error.message)
    }
  }

  /**회원탈퇴 전 확인모달 토글 */
  const toggleDeleteAccountModal = () => {
    setIsDeleteAccountModalOpen((prev) => !prev)
  }

  /**회원탈퇴 API 호출 */
  const deleteAccount = async (e) => {
    e.preventDefault()
    try {
      await deleteUserApi()
      setIsDeleteAccountModalOpen(false)
      logout()
    } catch (error) {
      console.error('회원탈퇴 중 오류 발생: ', error.message)
    }
  }

  return (
    <>
      {/* /**회원탈퇴 모달 */}
      {isDeleteAccountModalOpen && (
        <DeleteTripModal
          toggleDeleteAccountModal={toggleDeleteAccountModal}
          deleteAccount={deleteAccount}
        />
      )}

      <div className={style}>문의하기</div>
      <div onClick={handleSignOut} className={style}>
        로그아웃
      </div>
      <div onClick={toggleDeleteAccountModal} className={style}>
        회원탈퇴
      </div>
    </>
  )
}

export default AccountSettings
