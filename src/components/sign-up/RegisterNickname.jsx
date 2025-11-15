import nicknameDupCheckApi from '@/apis/authentication/nicknameDupCheckApi'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

/**닉네임 등록 화면 */
const RegisterNickname = ({ setIsNicknameVerified, setNickname }) => {
  /**닉네임 메세지 */
  const [nicknameError, setNicknameError] = useState('')
  const [nicknameMessage, setNicknameMessage] = useState('')

  /**useForm */
  const { register, watch } = useForm()

  /**닉네임 입력값 검사 */
  const nickname = watch('nickname')

  /**닉네임 값 변경 시 메세지 초기화 */
  useEffect(() => {
    setNicknameMessage('')
    setNicknameError('')
  }, [nickname])

  /**닉네임 중복 검사통과 시 버튼 활성화 */
  useEffect(() => {
    setIsNicknameVerified(nicknameMessage)
  }, [nicknameMessage, setIsNicknameVerified])

  /**닉네임 중복 확인 API 호출 */
  const handleDupCheckNickname = async () => {
    try {
      await nicknameDupCheckApi(nickname)
      setNicknameMessage('사용 가능한 닉네임이에요')
      setIsNicknameVerified(true)
      setNickname(nickname)
    } catch (err) {
      setNicknameError('이미 사용중인 닉네임이에요')
      console.error(err)
    }
  }
  return (
    <div>
      <div className='mb-15 px-10'>
        {/* 닉네임 등록 화면 상단 문구 */}
        <div className='text-4xl/[1.4] font-bold text-[var(--Grey-Scale-grey-400)]'>
          서비스에서 사용할
          <br />
          닉네임을 입력해주세요
        </div>
        <div className='text-lg/[2] text-[var(--Grey-Scale-grey-300)]'>
          가입 후 언제든지 수정이 가능해요
        </div>
      </div>

      {/* 닉네임 설정 Form */}
      <form className='flex h-full w-full flex-col gap-2 px-10'>
        <div className='mb-[30px] flex w-full flex-col justify-between gap-2'>
          {/* 닉네임 Input */}
          <label className='text-xl'>닉네임</label>
          <div className='relative flex w-full flex-col'>
            <input
              {...register('nickname')}
              placeholder='닉네임을 입력해주세요'
              type='text'
              className='border-none bg-gray-100 p-[20px] text-xl'
            />
            <button
              type='button'
              disabled={!nickname}
              onClick={handleDupCheckNickname}
              className={`absolute top-1/2 right-5 -translate-y-1/2 rounded-[18px] border-none px-[11px] py-[4px] text-lg text-[var(--Grey-Scale-grey-00)] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.10)] transition-colors ${
                nickname
                  ? 'cursor-pointer bg-[var(--Blue-Scale-blue-500)]'
                  : 'cursor-not-allowed bg-[var(--Grey-Scale-grey-200)]'
              }`}
            >
              중복확인
            </button>
          </div>

          {/* 닉네임 중복확인 메세지 */}
          <div className='h-[20px]'>
            {nicknameError ? (
              <p className='text-right text-sm text-red-500'>
                이미 사용중인 닉네임이에요
              </p>
            ) : (
              nicknameMessage && (
                <p className='text-right text-sm text-[var(--Blue-Scale-blue-500)]'>
                  사용 가능한 닉네임이에요
                </p>
              )
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default RegisterNickname
