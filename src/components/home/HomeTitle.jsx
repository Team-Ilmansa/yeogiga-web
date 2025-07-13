/**홈 화면 제목 */
const HomeTitle = ({ user }) => {
  return (
    //TODO: 여행 상황에 따라서 문구 변경
    <div className='text-4xl/[1.4] font-bold text-[var(--Grey-Scale-grey-400)]'>
      {user?.nickname}님,
      <br />
      여행 계획 있으신가요?
    </div>
  )
}

export default HomeTitle
