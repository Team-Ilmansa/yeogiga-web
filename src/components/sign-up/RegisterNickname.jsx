/**닉네임 등록 화면 */
const RegisterNickname = () => {
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
        {/* 닉네임 Input */}
        <label className='text-xl'>닉네임</label>
        <input
          name='nickname'
          placeholder='닉네임을 입력해주세요'
          type='text'
          className='mb-[30px] border-none bg-gray-100 p-[20px] text-xl'
        />
      </form>
    </div>
  )
}

export default RegisterNickname
