/**비밀번호 등록 화면 */
const RegisterPassword = () => {
  return (
    <div>
      <div className='mb-15 px-10'>
        {/* 비밀번호 등록 화면 상단 문구 */}
        <div className='text-4xl/[1.4] font-bold text-[var(--Grey-Scale-grey-400)]'>
          로그인에 사용할
          <br />
          비밀번호를 설정해주세요
        </div>
        <div className='text-lg/[2] text-[var(--Grey-Scale-grey-300)]'>
          영문, 숫자, 특수기호 포함 8~20자이내로 설정할 수 있어요
        </div>
      </div>

      {/* 비밀번호 설정 Form */}
      <form className='flex h-full w-full flex-col gap-2 px-10'>
        {/* 비밀번호 Input */}
        <label className='text-xl'>비밀번호</label>
        <input
          name='password'
          placeholder='비밀번호를 입력해주세요'
          type='password'
          className='mb-[30px] border-none bg-gray-100 p-[20px] text-xl'
        />

        {/* 비밀번호 확인 Input */}
        <label className='text-xl'>비밀번호 확인</label>
        <input
          name='password'
          placeholder='비밀번호를 입력해주세요'
          type='password'
          className='border-none bg-gray-100 p-[20px] text-xl'
        />
      </form>
    </div>
  )
}

export default RegisterPassword
