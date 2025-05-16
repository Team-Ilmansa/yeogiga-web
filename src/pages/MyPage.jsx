import updateNicknameApi from '@/apis/users/updateNicknameApi'
import userInfoApi from '@/apis/users/userInfoApi'
import patchUsersPasswordApi from '@/apis/users/patchUsersPasswordApi'
import { useEffect, useState } from 'react'
import useAuth from '@/hooks/useAuth'

const MyPage = () => {
  const [userInfo, setUserInfo] = useState([])
  const [newNickname, setNewNickname] = useState('')
  const [originalPassword, setOriginalPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isNicknameInputOpen, setIsNicknameInputOpen] = useState(false)
  const [isPasswordInputOpen, setIsPasswordInputOpen] = useState(false)
  const { logout } = useAuth()

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

  /**닉네임 변경 API 호출 */
  const updateNickname = async (e) => {
    e.preventDefault()
    try {
      const result = await updateNicknameApi({ nickname: newNickname })
      console.log('닉네임 변경 성공: ', result)
      alert('닉네임이 성공적으로 변경되었습니다!')
      fetchUserInfo()
      setIsNicknameInputOpen(false)
    } catch (err) {
      console.error('닉네임 변경 에러: ', err)
      alert(err.message)
    }
  }
  /**비밀번호 변경 API 호출 */
  const updatePassword = async (e) => {
    e.preventDefault()
    try {
      const result = await patchUsersPasswordApi({
        originalPassword,
        newPassword,
      })
      console.log('비밀번호 변경 성공: ', result)
      alert('비밀번호가 성공적으로 변경되었습니다!')
      fetchUserInfo()
      setIsPasswordInputOpen(false)
      logout()
    } catch (err) {
      console.log('비밀번호 변경 실패:', err)
      alert(err.message)
    }
  }

  /**닉네임 입력 창 출력 상태 토글 */
  const toggleNicknameInput = () => {
    setIsNicknameInputOpen((prev) => !prev)
    setNewNickname('')
  }

  /**비밀번호 입력 창 출력 상태 토글*/
  const togglePasswordInput = () => {
    setIsPasswordInputOpen((prev) => !prev)
    setOriginalPassword('')
    setNewPassword('')
  }

  useEffect(() => {
    fetchUserInfo()
  }, [])

  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center gap-2'>
      <p>닉네임: {userInfo.nickname}</p>
      <button onClick={toggleNicknameInput}>닉네임 변경</button>
      {isNicknameInputOpen && (
        <form onSubmit={updateNickname} className='flex gap-2'>
          <input
            placeholder='새로운 닉네임을 입력해주세요'
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            className='w-75'
          />
          <button type='submit'>확인</button>
        </form>
      )}

      <p>이메일: {userInfo.email}</p>

      <button onClick={togglePasswordInput}>비밀번호 변경</button>
      {isPasswordInputOpen && (
        <form
          onSubmit={updatePassword}
          className='flex flex-col items-center justify-center gap-2'
        >
          <input
            placeholder='기존 비밀번호를 입력해주세요'
            value={originalPassword}
            onChange={(e) => setOriginalPassword(e.target.value)}
            className='w-75'
            type='password'
          />
          <input
            placeholder='새로운 비밀번호를 입력해주세요'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className='w-75'
            type='password'
          />
          <button type='submit'>변경하기</button>
        </form>
      )}
    </div>
  )
}

export default MyPage
