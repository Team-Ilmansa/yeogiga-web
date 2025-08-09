import restoreAccountApi from '@/apis/authentication/restoreAccountApi'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const RestoreAccount = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { userId, deletionDate } = location.state || {}

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

  return (
    // TODO: 페이지 디자인 변경
    <div className='mx-auto max-w-md p-6 text-center'>
      <h1 className='mb-4 text-2xl font-bold'>계정 복구 안내</h1>
      <p className='mb-2'>이 계정은 탈퇴 처리된 상태입니다.</p>
      <p className='mb-4 text-sm text-gray-500'>
        <strong>{new Date(deletionDate).toLocaleString()}</strong> 이후에는
        복구가 불가능합니다.
      </p>
      <button
        onClick={restoreAccount}
        className='rounded bg-blue-500 px-6 py-2 text-white'
      >
        계정 복구하기
      </button>
    </div>
  )
}

export default RestoreAccount
