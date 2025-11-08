import { ChevronRight } from 'lucide-react'
import kakaoLogoImg from '@/assets/mypage/kakaoIcon.png'
import naverLogoImg from '@/assets/mypage/naverIcon.png'
import { getLoginType, getProvider } from './utils/Indentity'

const ProfileCard = ({ userInfo, onProfileClick }) => {
  const loginType = getLoginType(userInfo)
  const provider = getProvider(userInfo)
  const isSocial = loginType === 'SOCIAL'

  const isKakao = isSocial && provider === 'KAKAO'
  const isNaver = isSocial && provider === 'NAVER'

  /** 닉네임 앞 두 글자 추출 */
  const nicknameInitials = userInfo?.nickname
    ? userInfo.nickname.slice(0, 2)
    : ''

  /** 닉네임 기반 색상 생성 함수 */
  const getStableColor = (name) => {
    if (!name) return '#FFFFFF'
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    const hue = Math.abs(hash) % 360
    const saturation = 70
    const lightness = 55
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }

  const stableColor = getStableColor(userInfo?.nickname)

  return (
    <div className='mx-10 flex h-[160px] w-[800px] items-center rounded-[20px] border border-gray-100 bg-white px-5 shadow-sm'>
      <div className='mr-8 flex aspect-square w-35 items-center justify-center overflow-hidden rounded-full bg-gray-100'>
        <img
          src={
            userInfo && userInfo.imageUrl
              ? userInfo.imageUrl
              : '/images/default_profile.png'
          }
          alt='프로필'
          className='h-full w-full rounded-full object-cover'
        />
      </div>

      <div className='flex w-full flex-col justify-center'>
        <div className='mb-2 flex items-center gap-1'>
          {isKakao && (
            <img src={kakaoLogoImg} alt='Kakao' className='h-7 w-auto' />
          )}
          {isNaver && (
            <img src={naverLogoImg} alt='Naver' className='h-7 w-auto' />
          )}

          <span className='text-3xl font-bold text-gray-900'>
            {userInfo && userInfo.nickname ? userInfo.nickname : '사용자'}
          </span>
          <span className='text-xl font-bold text-gray-900'>님</span>
        </div>

        <div className='flex items-center justify-between'>
          {userInfo && userInfo.email && (
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
