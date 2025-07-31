import updateNicknameApi from '@/apis/users/updateNicknameApi'
import userInfoApi from '@/apis/users/userInfoApi'
import updatePasswordApi from '@/apis/users/updatePasswordApi'
import { useEffect, useRef, useState } from 'react'
import useAuth from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import updateProfileApi from '@/apis/users/updateProfileApi'
import HomeButton from '@/components/home/HomeButton'

import { ChevronRight } from 'lucide-react'
import ProfileCard from '@/components/mypage/ProfileCard'
import FavoritePhotos from '@/components/mypage/FavoritePhotos'
import PastTrip from '@/components/mypage/PastTrip'

const MyPage = () => {
  const [userInfo, setUserInfo] = useState([])
  const [newNickname, setNewNickname] = useState('')
  const [originalPassword, setOriginalPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isNicknameInputOpen, setIsNicknameInputOpen] = useState(false)
  const [isPasswordInputOpen, setIsPasswordInputOpen] = useState(false)
  const { logout, user } = useAuth()
  const loginType = user?.loginType
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const fileInputRef = useRef()

  /**회원 정보 조회 API 호출 */
  const fetchUserInfo = async () => {
    try {
      const result = await userInfoApi()
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
      alert('닉네임이 성공적으로 변경되었습니다!')
      fetchUserInfo()
      setIsNicknameInputOpen(false)
      logout()
    } catch (err) {
      console.error('닉네임 변경 에러: ', err)
      alert(err.message)
    }
  }
  /**비밀번호 변경 API 호출 */
  const updatePassword = async (e) => {
    e.preventDefault()
    try {
      const result = await updatePasswordApi({
        originalPassword: originalPassword,
        newPassword: newPassword,
      })
      alert('비밀번호가 성공적으로 변경되었습니다!')
      fetchUserInfo()
      setIsPasswordInputOpen(false)
      logout()
    } catch (err) {
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

  /**프로필 사진 등록 및 수정 API 호출 */
  const updateProfileUpload = async (e) => {
    const profileImage = e.target.files[0]
    if (!profileImage) return
    setSelectedFile(profileImage)
    setPreviewUrl(URL.createObjectURL(profileImage))

    const formData = new FormData()
    formData.append('image', profileImage)
    try {
      const result = await updateProfileApi(formData)
      fetchUserInfo()
      alert('프로필 사진이 성공적으로 업로드되었습니다.')
    } catch (err) {
      alert(err.message)
      console.error(err)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  useEffect(() => {
    fetchUserInfo()
  }, [])

  return (
    <>
      <div className='flex w-full flex-col gap-15 bg-[var(--Grey-Scale-grey-50)] pt-10 pb-50 pl-10'>
        {/* 마이페이지 유저정보 */}
        <div>
          <h1 className='text-4xl leading-normal font-bold'>
            {userInfo.nickname}님의
            <br />
            마이페이지
          </h1>
        </div>
        {/* 프로필카드 */}
        <ProfileCard userInfo={userInfo} />
        {/* 즐겨찾기한 사진 */}
        <FavoritePhotos />
        {/* 지난 여행 전체보기 */}
        <PastTrip />
        {/* TODO: 이외 기능 추가 */}
        <div className='flex h-screen w-screen flex-col items-center justify-center gap-2'>
          <button onClick={handleUploadClick}>프로필 수정</button>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={updateProfileUpload}
            className='hidden'
          />
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
          {loginType !== 'SOCIAL' && (
            <>
              <p>이메일: {userInfo.email}</p>
              <button onClick={togglePasswordInput}>비밀번호 변경</button>x
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
            </>
          )}
          <button onClick={() => navigate('/')}>홈으로 이동</button>
          <HomeButton currentPage='mypage' />
        </div>
      </div>
    </>
  )
}

export default MyPage
