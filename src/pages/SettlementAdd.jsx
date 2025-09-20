import GoBack from '@/assets/sign-up/GoBack'
import FixedActionBar from '@/components/common/FixedActionBar'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import readMemberApi from '@/apis/member/readMemberApi'
import createSettlementApi from '@/apis/settlement/createSettlementApi'
import CategorySelector from '@/components/common/CategorySelector'

/**정산 내역 추가 페이지 */
const pad2 = (v) => String(v).toString().padStart(2, '0')
const formatWon = (n) => Number(n).toLocaleString('ko-KR')

const amountAndTitleInputClass =
  'h-18 w-full rounded-2xl bg-gray-100 px-4 pr-12 text-xl placeholder:text-gray-400 border-none outline-none'
const dateInputClass =
  'h-18 rounded-2xl bg-gray-100 px-0 text-lg text-center placeholder:text-gray-400 border-none outline-none'
const sectionTitleClass = 'mb-2 text-xl text-gray-800'
const dateDotClass = 'self-end text-4xl text-gray-500'

const SettlementAdd = () => {
  const navigate = useNavigate()
  const { tripId, userId } = useParams()

  const [amountInput, setAmountInput] = useState('')
  const [settlementTitle, setSettlementTitle] = useState('')
  const [dateInput, setDateInput] = useState({ year: '', month: '', day: '' })
  const [category, setCategory] = useState('ETC')

  const [memberList, setMemberList] = useState([])
  const [isLoadingMembers, setIsLoadingMembers] = useState(false)
  const [selectedPayersByUserId, setSelectedPayersByUserId] = useState({})
  const [allocatedByUserId, setAllocatedByUserId] = useState({}) // 1/n 분배 결과
  const [isManualInput, setIsManualInput] = useState(false) // 수동입력 모드
  const [manualAmountByUserId, setManualAmountByUserId] = useState({}) // 수동 금액
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEvenSplitActive, setIsEvenSplitActive] = useState(false) // ✅ 1/n 분배 활성 상태

  const currentUserId = userId ? Number(userId) : null

  // 여행 멤버 조회
  useEffect(() => {
    let isMounted = true
    const fetchTripMembers = async () => {
      if (!tripId) return
      try {
        setIsLoadingMembers(true)
        const result = await readMemberApi(tripId)
        const members = result.data
        if (!isMounted) return

        const sortedMembers = [...members].sort((a, b) => {
          if (currentUserId != null) {
            if (a.userId === currentUserId) return -1
            if (b.userId === currentUserId) return 1
          }
          return a.nickname.localeCompare(b.nickname, 'ko')
        })
        setMemberList(sortedMembers)
        setSelectedPayersByUserId(
          Object.fromEntries(sortedMembers.map((m) => [m.userId, true])),
        )
      } catch (error) {
        alert(error.message || '여행 멤버를 불러오지 못했습니다.')
      } finally {
        setIsLoadingMembers(false)
      }
    }

    fetchTripMembers()
    return () => {
      isMounted = false
    }
  }, [tripId, currentUserId])

  // 선택 인원 수
  const selectedCount = useMemo(
    () =>
      memberList.reduce(
        (acc, m) => acc + (selectedPayersByUserId[m.userId] ? 1 : 0),
        0,
      ),
    [memberList, selectedPayersByUserId],
  )

  // 확인 버튼 활성화 조건
  const isConfirmEnabled = useMemo(() => {
    const hasTitle = !!settlementTitle.trim()
    const hasAmount = !!amountInput
    const hasDate = !!dateInput.year && !!dateInput.month && !!dateInput.day
    const hasAnyPayer = selectedCount > 0
    return hasTitle && hasAmount && hasDate && hasAnyPayer
  }, [settlementTitle, amountInput, dateInput, selectedCount])

  const handleBack = () => navigate(-1)

  const formatDate = ({ year, month, day }) =>
    `${year}-${pad2(month)}-${pad2(day)}`
  const isValidDateInputs = ({ year, month, day }) =>
    year.length === 4 && month.length >= 1 && day.length >= 1

  // 균등분배 계산(선택된 멤버만)
  const computeEvenAllocation = useCallback((total, members, selectedMap) => {
    const selected = members.filter((m) => selectedMap[m.userId])
    if (selected.length === 0) return {}
    const base = Math.floor(total / selected.length)
    let remainder = total - base * selected.length
    const map = {}
    for (const m of selected) {
      map[m.userId] = base + (remainder > 0 ? 1 : 0)
      if (remainder > 0) remainder -= 1
    }
    return map
  }, [])

  // 1/n 정산하기: 수동 모드 해제 + 분배 활성화 + 분배 갱신
  const handleSplitEvenly = useCallback(() => {
    if (!/^\d+$/.test(amountInput))
      return alert('정산 비용에 숫자를 입력해주세요.')
    const total = Number(amountInput)
    if (total <= 0) return alert('정산 비용은 1원 이상이어야 합니다.')
    if (selectedCount === 0) return alert('정산 인원을 선택해주세요.')

    setIsManualInput(false)
    setIsEvenSplitActive(true) // ✅ 분배 모드 on
    setAllocatedByUserId(
      computeEvenAllocation(total, memberList, selectedPayersByUserId),
    )
  }, [
    amountInput,
    selectedCount,
    memberList,
    selectedPayersByUserId,
    computeEvenAllocation,
  ])

  // 직접입력: 수동 모드 ON, 1/n 모드 OFF, 현재 1/n 결과를 초기값으로 사용(없으면 빈 값)
  const handleManualInputMode = useCallback(() => {
    setIsManualInput(true)
    setIsEvenSplitActive(false) // ✅ 분배 모드 off
    setManualAmountByUserId((prev) => {
      const source = Object.keys(allocatedByUserId).length
        ? allocatedByUserId
        : {}
      const map = { ...prev }
      memberList.forEach((m) => {
        if (selectedPayersByUserId[m.userId]) {
          map[m.userId] = source[m.userId] ?? map[m.userId] ?? ''
        }
      })
      return map
    })
  }, [allocatedByUserId, memberList, selectedPayersByUserId])

  // 선택 토글
  const toggleSelectPayer = useCallback(
    (toggleUserId) => {
      setSelectedPayersByUserId((prev) => {
        const next = { ...prev, [toggleUserId]: !prev[toggleUserId] }

        // ✅ 1/n 활성 상태라면, 현재 선택 상태(next) 기준으로 즉시 재분배
        if (
          isEvenSplitActive &&
          /^\d+$/.test(amountInput) &&
          Number(amountInput) > 0
        ) {
          const nextAlloc = computeEvenAllocation(
            Number(amountInput),
            memberList,
            next,
          )
          setAllocatedByUserId(nextAlloc) // 선택 전원이 해제되면 {}가 들어가며, 모드는 유지
        }

        // 수동 모드에서는 금액 유지(표시만 토글). 새로 체크되면 빈 값으로 시작
        if (
          isManualInput &&
          next[toggleUserId] &&
          manualAmountByUserId[toggleUserId] == null
        ) {
          setManualAmountByUserId((prevManual) => ({
            ...prevManual,
            [toggleUserId]: '',
          }))
        }
        return next
      })
    },
    [
      isEvenSplitActive,
      amountInput,
      memberList,
      computeEvenAllocation,
      isManualInput,
      manualAmountByUserId,
    ],
  )

  // 총액 변경 시, 1/n 활성 상태면 재분배 (수동 모드 제외)
  useEffect(() => {
    if (isManualInput) return
    if (!isEvenSplitActive) return
    if (!/^\d+$/.test(amountInput)) {
      setAllocatedByUserId({})
      return
    }
    const total = Number(amountInput)
    if (total <= 0) {
      setAllocatedByUserId({})
      return
    }
    setAllocatedByUserId(
      computeEvenAllocation(total, memberList, selectedPayersByUserId),
    )
  }, [
    amountInput,
    memberList,
    selectedPayersByUserId,
    computeEvenAllocation,
    isManualInput,
    isEvenSplitActive,
  ])

  // 수동 입력값 변경
  const handleChangeManualAmount = useCallback((userId, value) => {
    const onlyDigits = value.replace(/[^0-9]/g, '')
    setManualAmountByUserId((prev) => ({ ...prev, [userId]: onlyDigits }))
  }, [])

  // 정산 생성 제출
  const handleSubmitSettlement = useCallback(async () => {
    if (!tripId || isSubmitting) return

    const name = settlementTitle.trim()
    if (!name) return alert('내역 이름을 입력해주세요.')
    if (!/^\d+$/.test(amountInput)) return alert('금액은 숫자만 입력해주세요.')

    const totalPrice = Number(amountInput)
    if (totalPrice <= 0) return alert('금액은 1원 이상이어야 합니다.')
    if (!isValidDateInputs(dateInput))
      return alert('날짜 형식을 확인해주세요. (YYYY.MM.DD)')

    const selectedMembers = memberList.filter(
      (m) => selectedPayersByUserId[m.userId],
    )
    if (selectedMembers.length === 0) return alert('정산 인원을 선택해주세요.')

    let payers
    if (isManualInput) {
      const anyInvalid = selectedMembers.some(
        (m) => !/^\d+$/.test(String(manualAmountByUserId[m.userId] ?? '')),
      )
      if (anyInvalid) return alert('직접 입력한 금액에 숫자만 입력해주세요.')
      payers = selectedMembers.map((m) => ({
        userId: m.userId,
        price: Number(manualAmountByUserId[m.userId] || 0),
        isCompleted: true,
      }))
    } else if (isEvenSplitActive) {
      // 1/n 활성 상태 기준 사용 (선택이 0이면 여기까지 오기 전에 가드됨)
      payers = selectedMembers.map((m) => ({
        userId: m.userId,
        price: allocatedByUserId[m.userId] ?? 0,
        isCompleted: true,
      }))
    } else {
      // 즉시 균등 계산
      const base = Math.floor(totalPrice / selectedMembers.length)
      let remainder = totalPrice - base * selectedMembers.length
      payers = selectedMembers.map((m) => {
        const price = base + (remainder > 0 ? 1 : 0)
        if (remainder > 0) remainder -= 1
        return { userId: m.userId, price, isCompleted: true }
      })
    }

    const requestBody = {
      name,
      totalPrice,
      date: formatDate(dateInput),
      type: category,
      payers,
    }

    try {
      setIsSubmitting(true)
      await createSettlementApi(tripId, requestBody)
      alert('정산 내역이 등록되었습니다.')
    } catch (error) {
      alert(error.message || '정산 내역 등록에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }, [
    tripId,
    isSubmitting,
    settlementTitle,
    amountInput,
    dateInput,
    category,
    memberList,
    selectedPayersByUserId,
    allocatedByUserId,
    isManualInput,
    manualAmountByUserId,
    isEvenSplitActive,
  ])

  const MemberSelectRow = React.memo(function MemberSelectRow({ member }) {
    const isCurrentUser =
      currentUserId != null && member.userId === currentUserId
    const isSelected = !!selectedPayersByUserId[member.userId]
    const allocated = allocatedByUserId[member.userId]
    const hasAllocation = Object.keys(allocatedByUserId).length > 0

    return (
      <div className='flex items-center justify-between rounded-xl px-1 py-3'>
        <div className='flex items-center gap-3'>
          <div className='relative h-9 w-9 overflow-hidden rounded-full bg-gray-200'>
            {member.imageUrl ? (
              <img
                src={member.imageUrl}
                alt={`${member.nickname} 프로필 이미지`}
                className='h-full w-full object-cover'
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : null}
          </div>
          <div className='text-base text-gray-800'>
            {isCurrentUser ? '(나) ' : ''}
            {member.nickname}
          </div>
        </div>

        <div className='flex items-center gap-3'>
          {/* 오른쪽 영역 */}
          <div className='min-w-[120px] text-right text-gray-800'>
            {isManualInput && isSelected ? (
              <div className='relative'>
                <input
                  type='text'
                  inputMode='numeric'
                  value={manualAmountByUserId[member.userId]}
                  onChange={(e) =>
                    handleChangeManualAmount(member.userId, e.target.value)
                  }
                  placeholder='금액입력'
                  className='w-[110px] appearance-none rounded-none border-none bg-transparent px-0 py-1 pr-6 text-right text-sm outline-none focus:ring-0 focus:outline-none'
                />
                <span className='pointer-events-none absolute top-1/2 right-1 -translate-y-1/2 text-sm text-gray-500'>
                  원
                </span>
              </div>
            ) : hasAllocation && isSelected && allocated != null ? (
              `${formatWon(allocated)}원`
            ) : (
              ''
            )}
          </div>

          {/* 체크 버튼 */}
          <button
            onClick={() => toggleSelectPayer(member.userId)}
            className={`relative flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
              isSelected
                ? 'border-[var(--Blue-Scale-blue-500)] bg-[var(--Blue-Scale-blue-500)]'
                : 'border-gray-300 bg-white'
            }`}
            aria-pressed={isSelected}
          >
            {isSelected && (
              <span
                className='block h-[10px] w-[6px] rotate-45'
                style={{
                  borderRight: '2px solid #fff',
                  borderBottom: '2px solid #fff',
                  marginTop: '-1px',
                }}
              />
            )}
          </button>
        </div>
      </div>
    )
  })

  return (
    <div className='flex w-full flex-col pt-5'>
      {/* 헤더 */}
      <div className='relative mb-5 flex items-center px-8'>
        <button className='border-none' onClick={handleBack}>
          <GoBack />
        </button>
        <div className='absolute left-1/2 -translate-x-1/2 text-lg font-semibold'>
          정산 내역 추가하기
        </div>
      </div>

      {/* 본문 */}
      <div className='space-y-6 px-10'>
        {/* 정산 비용 */}
        <div>
          <div className={sectionTitleClass}>정산 비용</div>
          <div className='relative'>
            <input
              type='text'
              inputMode='numeric'
              value={amountInput}
              onChange={(e) =>
                setAmountInput(e.target.value.replace(/[^0-9]/g, ''))
              }
              placeholder='금액을 입력해주세요'
              className={amountAndTitleInputClass}
            />
            <span className='pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xl text-gray-500'>
              원
            </span>
          </div>
        </div>

        {/* 내역 이름 */}
        <div>
          <div className={sectionTitleClass}>내역 이름</div>
          <input
            type='text'
            value={settlementTitle}
            onChange={(e) => setSettlementTitle(e.target.value)}
            placeholder='내역 이름을 입력해주세요'
            className={amountAndTitleInputClass}
          />
        </div>

        {/* 날짜 */}
        <div>
          <div className={sectionTitleClass}>날짜</div>
          <div className='flex items-center gap-2'>
            <input
              type='text'
              inputMode='numeric'
              maxLength={4}
              placeholder='YYYY'
              value={dateInput.year}
              onChange={(e) =>
                setDateInput((prev) => ({
                  ...prev,
                  year: e.target.value.replace(/[^0-9]/g, ''),
                }))
              }
              className={`${dateInputClass} w-28`}
            />
            <span className={dateDotClass}>.</span>
            <input
              type='text'
              inputMode='numeric'
              maxLength={2}
              placeholder='MM'
              value={dateInput.month}
              onChange={(e) =>
                setDateInput((prev) => ({
                  ...prev,
                  month: e.target.value.replace(/[^0-9]/g, ''),
                }))
              }
              className={`${dateInputClass} w-20`}
            />
            <span className={dateDotClass}>.</span>
            <input
              type='text'
              inputMode='numeric'
              maxLength={2}
              placeholder='DD'
              value={dateInput.day}
              onChange={(e) =>
                setDateInput((prev) => ({
                  ...prev,
                  day: e.target.value.replace(/[^0-9]/g, ''),
                }))
              }
              className={`${dateInputClass} w-20`}
            />
          </div>
        </div>

        {/* 카테고리 */}
        <div className={sectionTitleClass}>카테고리</div>
        <CategorySelector value={category} onChange={setCategory} size={50} />

        {/* 정산 인원 */}
        <div className='mt-4'>
          <div className='mb-2 flex items-center justify-between pr-3'>
            <div className='text-xl text-gray-800'>
              정산 인원{' '}
              <span className='text-[var(--Blue-Scale-blue-500)]'>
                {selectedCount}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <button
                type='button'
                onClick={handleSplitEvenly}
                className='text-m rounded-full border border-gray-200 px-3 py-1 text-[var(--Blue-Scale-blue-500)]'
              >
                1/n 정산하기
              </button>
              <button
                type='button'
                onClick={handleManualInputMode}
                className='text-m rounded-full border border-gray-200 px-3 py-1 text-gray-700'
              >
                직접입력
              </button>
            </div>
          </div>

          <div className='px-3 py-1'>
            {isLoadingMembers ? (
              <div className='px-2 py-6 text-center text-gray-500'>
                멤버를 불러오는 중…
              </div>
            ) : memberList.length === 0 ? (
              <div className='px-2 py-6 text-center text-gray-500'>
                여행 멤버가 없습니다.
              </div>
            ) : (
              memberList.map((member) => (
                <MemberSelectRow key={member.userId} member={member} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* 확인 버튼 */}
      <FixedActionBar className='flex justify-center'>
        <div className='flex w-4xl items-center justify-center rounded-t-[20px] bg-white p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
          <button
            disabled={!isConfirmEnabled || isSubmitting}
            onClick={handleSubmitSettlement}
            className={`w-full rounded-lg border-none p-[20px] text-2xl text-white ${
              isConfirmEnabled
                ? 'bg-[var(--Blue-Scale-blue-500)]'
                : 'cursor-not-allowed bg-gray-300'
            }`}
          >
            {isSubmitting ? '저장 중…' : '확인'}
          </button>
        </div>
      </FixedActionBar>
    </div>
  )
}

export default SettlementAdd
