import TripTitle from '@/components/dashboard/TripTitle'

const Dashboard = () => {
  return (
    // 뒤로가기 버튼

    // 여행 타이틀
    <div className='flex w-full flex-col gap-15 bg-[var(--Grey-Scale-grey-50)] pt-10 pb-50 pl-10'>
      <TripTitle />
    </div>
  )
}

export default Dashboard
