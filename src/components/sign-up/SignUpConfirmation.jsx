/**회원가입 완료 화면 */
const SignUpConfirmation = ({ nickname }) => {
  return (
    <div>
      <div className='mb-15 px-10'>
        {/* 회원가입 완료 화면 상단 문구 */}
        <div className='text-4xl/[1.4] font-bold text-[var(--Grey-Scale-grey-400)]'>
          {nickname}님
          <br />
          여기가 가입을 축하드려요!
        </div>
        <div className='text-lg/[2] text-[var(--Grey-Scale-grey-300)]'>
          여기가와 함께 더 체계적인 단체 여행을 즐겨봐요
        </div>
      </div>
    </div>
  )
}

export default SignUpConfirmation
