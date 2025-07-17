/**이용 약관 동의 화면 */
const TermsAgreement = () => {
  return (
    <div>
      <div className='mb-15 px-10'>
        {/* 이용약관 동의 화면 상단 문구 */}
        <div className='text-4xl/[1.4] font-bold text-[var(--Grey-Scale-grey-400)]'>
          서비스 이용약관에
          <br />
          동의해주세요
        </div>
        <div className='text-lg/[2] text-[var(--Grey-Scale-grey-300)]'>
          정확한 데이터 조회와 더 원활한 서비스 이용을 위해 꼭 필요해요
        </div>
      </div>
    </div>
  )
}

export default TermsAgreement
