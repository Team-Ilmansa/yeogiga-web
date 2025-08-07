/** 회원 탈퇴하기 모달창 */
const DeleteTripModal = ({ toggleDeleteAccountModal, deleteAccount }) => {
  return (
    <div
      onClick={toggleDeleteAccountModal}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
    >
      <form
        onSubmit={deleteAccount}
        onClick={(e) => e.stopPropagation()}
        className='shadow-[0_0_4px_0_rgba(0,0,0,0.10)]" flex w-[400px] flex-col justify-center gap-2 rounded-[20px] bg-white p-[20px]'
      >
        <div className='mt-2 text-2xl font-bold text-[var(--Grey-Scale-grey-400)]'>
          정말로 탈퇴하시겠습니까?
        </div>
        <div className='mb-10 text-base text-[var(--Grey-Scale-grey-300)]'>
          계정은 7일 이내 다시 복구 가능해요
        </div>

        <div className='flex justify-end'>
          <button
            type='submit'
            className='border-none bg-[var(--Blue-Scale-blue-500)] px-[30px] py-[10px] text-lg text-[var(--Grey-Scale-grey-00)]'
          >
            탈퇴하기
          </button>
        </div>
      </form>
    </div>
  )
}

export default DeleteTripModal
