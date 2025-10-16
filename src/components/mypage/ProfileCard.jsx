import { ChevronRight } from 'lucide-react'
import kakaoLogoImg from '@/assets/mypage/kakaoIcon.png'
import naverLogoImg from '@/assets/mypage/naverIcon.png'

const ProfileCard = ({ userInfo, onProfileClick }) => {
  const provider = localStorage.getItem('provider')

  return (
    <div className='mx-10 flex h-[160px] w-[800px] items-center rounded-[20px] border border-gray-100 bg-white px-5 shadow-sm'>
      <div className='mr-8 aspect-square w-35 overflow-hidden rounded-full bg-gray-100'>
        <img
          src={userInfo.imageUrl || '/images/default_profile.png'}
          alt='프로필'
          className='h-full w-full rounded-full object-cover'
        />
      </div>
      <div className='flex w-full flex-col justify-center'>
        <div className='mb-2 flex items-center gap-1'>
          {/** 소셜 로그인 로고 */}
          {provider === 'KAKAO' && (
            <img src={kakaoLogoImg} alt='Kakao' className='h-7 w-auto' />
          )}
          {provider === 'NAVER' && (
            <img src={naverLogoImg} alt='Naver' className='h-7 w-auto' />
          )}

          {/** 닉네임 */}
          <span className='text-3xl font-bold text-gray-900'>
            {userInfo.nickname}
          </span>
          <span className='text-xl font-bold text-gray-900'>님</span>
        </div>

        <div className='flex items-center justify-between'>
          {userInfo.email && (
            <p className='text-lg text-gray-500'>{userInfo.email}</p>
          )}
          <button
            onClick={onProfileClick}
            className='flex items-center border-none text-base text-gray-400 hover:text-gray-500'
          >
            프로필 관리
            <ChevronRight size={16} className='ml-1' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
