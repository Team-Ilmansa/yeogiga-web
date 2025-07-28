/**3개월 캘린더 생성 함수 */
const generateCalendar = () => {
  // 오늘의 년, 월 구하기
  const today = new Date()
  const baseYear = today.getFullYear()
  const baseMonth = today.getMonth()

  /**3개월치 달력이 들어갈 배열 */
  const allCalendars = []

  // 3개월치 달력 만들기
  for (let i = 0; i < 3; i++) {
    // 달력 만들 타깃 날짜 찾기
    const targetDate = new Date(baseYear, baseMonth + i, 1)
    const year = targetDate.getFullYear()
    const month = targetDate.getMonth()

    // 타깃 월의 시작 날짜, 끝 날짜, 요일, 총 날짜 수 구하기
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDay = firstDay.getDay()
    const totalDays = lastDay.getDate()

    // 달력의 첫 줄에 들어갈 요일 텍스트 넣기
    const daysArray = []
    daysArray.push(['일', '월', '화', '수', '목', '금', '토'])

    // 1일 앞에 빈칸 만들기
    let week = new Array(startDay).fill(null)

    // 한 주씩 daysArray에 넣기
    for (let date = 1; date <= totalDays; date++) {
      week.push(date)

      if (week.length === 7) {
        daysArray.push(week)
        week = []
      }
    }

    // 마지막 주가 7일이 안 되면 null로 채워서 daysArray에 넣기
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null)
      }
      daysArray.push(week)
    }

    // 년, 월, 달력(2차원 배열) 객체 저장
    allCalendars.push({
      year,
      month: month + 1,
      calendar: daysArray,
    })
  }

  // 완성된 세 달의 객체 리턴
  return allCalendars
}

export default generateCalendar
