/**이메일 인증 화면 */
const RegisterEmail = () => {
  return (
    <div>
      <div className='mb-15 px-10'>
        {/* 이메일 인증 화면 상단 문구 */}
        <div className='text-4xl/[1.4] font-bold text-[var(--Grey-Scale-grey-400)]'>
          로그인에 사용할
          <br />
          이메일을 입력해주세요
        </div>
        <div className='text-lg/[2] text-[var(--Grey-Scale-grey-300)]'>
          입력하신 이메일로 회원여부 확인 및 서비스 가입을 도와드릴게요
        </div>
      </div>

      {/* 이메일 인증 Form */}
      <div className='flex h-full w-full flex-col items-center px-10'>
        {/* 이메일 Input */}
        <div className='flex w-full flex-col justify-between gap-2'>
          <label className='text-xl'>이메일</label>
          <input
            placeholder='이메일을 입력해주세요'
            type='email'
            className='mb-[30px] border-none bg-gray-100 p-[20px] text-xl'
          />
        </div>

        {/* 이메일 인증번호 Input */}
        <form className='flex w-full flex-col justify-between gap-2'>
          <label className='text-xl'>이메일 확인</label>
          <div className='relative flex w-full flex-col'>
            <input
              placeholder='인증번호 6자리를 입력해주세요'
              type='text'
              className='border-none bg-gray-100 p-[20px] text-xl'
            />
            <button
              type='submit'
              className='absolute top-1/2 right-5 -translate-y-1/2 rounded-[18px] border-none bg-[var(--Grey-Scale-grey-200)] px-[11px] py-[4px] text-lg text-[var(--Grey-Scale-grey-00)] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.10)]'
            >
              재전송
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterEmail
