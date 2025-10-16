import { X, Pencil } from 'lucide-react'
import { useRef, useState } from 'react'
import updateNicknameApi from '@/apis/users/updateNicknameApi'
import updateProfileApi from '@/apis/users/updateProfileApi'

const ProfileModal = ({ userInfo, onClose, onUpdate }) => {
  const [newNickname, setNewNickname] = useState(userInfo.nickname)
  const fileInputRef = useRef()

  const handleNicknameChange = (e) => {
    setNewNickname(e.target.value)
  }

  const handleProfileImageChange = async (e) => {
    const profileImage = e.target.files[0]
    if (!profileImage) return

    const formData = new FormData()
    formData.append('image', profileImage)
    try {
      await updateProfileApi(formData)
      onUpdate()
      alert('프로필 사진이 성공적으로 변경되었습니다.')
    } catch (err) {
      alert(err.message)
      console.error(err)
    }
  }

  const handleUpdateNickname = async () => {
    try {
      await updateNicknameApi({ nickname: newNickname })
      onUpdate()
      alert('닉네임이 성공적으로 변경되었습니다.')
    } catch (err) {
      console.error('닉네임 변경 에러: ', err)
      alert(err.message)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='w-[500px] rounded-lg bg-white p-8'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-bold'>프로필 관리</h2>
          <button onClick={onClose} className='border-none'>
            <X size={30} color='var(--Blue-Scale-blue-500)' />
          </button>
        </div>
        <div className='mt-6 flex flex-col items-center'>
          <div className='relative mb-4'>
            <img
              src={userInfo.imageUrl || '/images/default_profile.png'}
              alt='프로필'
              className='h-40 w-40 rounded-full object-cover'
            />
            <button
              onClick={handleUploadClick}
              className='absolute right-0 bottom-0 rounded-full border-none bg-[var(--Blue-Scale-blue-500)] p-2'
            >
              <Pencil size={16} className='text-white' />
            </button>
            <input
              type='file'
              ref={fileInputRef}
              onChange={handleProfileImageChange}
              className='hidden'
              accept='image/*'
            />
          </div>
          <div className='w-full'>
            <label htmlFor='nickname' className='text-lg font-semibold'>
              닉네임
            </label>
            <div className='mt-2 flex gap-2'>
              <input
                id='nickname'
                type='text'
                value={newNickname}
                onChange={handleNicknameChange}
                className='flex-grow rounded-md border border-gray-300 p-2'
              />
              <button
                onClick={handleUpdateNickname}
                className='rounded-md bg-[var(--Blue-Scale-blue-500)] px-4 py-2 text-white'
              >
                변경
              </button>
            </div>
          </div>
        </div>
        <div className='mt-8 flex justify-end'></div>
      </div>
    </div>
  )
}

export default ProfileModal
