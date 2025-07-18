/**여행 생성하기 모달창 */
const CreateTripModal = ({
  toggleCreateTripModal,
  createTrip,
  tripTitle,
  setTripTitle,
}) => {
  return (
    <div
      onClick={toggleCreateTripModal}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
    >
      <form
        onSubmit={createTrip}
        onClick={(e) => e.stopPropagation()}
        className='shadow-[0_0_4px_0_rgba(0,0,0,0.10)]" flex w-[400px] flex-col justify-center gap-2 rounded-[20px] bg-white p-[20px]'
      >
        <div className='text-2xl font-bold text-[var(--Grey-Scale-grey-400)]'>
          여행 이름을 설정해주세요
        </div>
        <div className='mb-[15px] text-base text-[var(--Grey-Scale-grey-300)]'>
          추후 수정이 가능해요
        </div>
        <input
          placeholder='여행 이름을 입력해주세요.'
          value={tripTitle}
          onChange={(e) => setTripTitle(e.target.value)}
          className='mb-[30px] w-full border-none bg-[var(--Grey-Scale-grey-100)] p-[20px] text-xl'
          type='text'
        />
        <div className='flex justify-end'>
          <button
            type='submit'
            className='border-none bg-[var(--Blue-Scale-blue-500)] px-[50px] py-[20px] text-xl text-[var(--Grey-Scale-grey-00)]'
          >
            확인
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateTripModal
