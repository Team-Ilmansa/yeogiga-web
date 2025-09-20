import GoBack from '@/assets/sign-up/GoBack'
import FixedActionBar from '@/components/common/FixedActionBar'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import readMemberApi from '@/apis/member/readMemberApi'
import createSettlementApi from '@/apis/settlement/createSettlementApi'
import CategorySelector from '@/components/common/CategorySelector'

const pad2 = (v) => String(v).padStart(2, '0')
const onlyDigits = (v) => String(v).replace(/[^0-9]/g, '')

/** 원, 천단위 콤마 표시 */
const formatWon = (n) => Number(n).toLocaleString('ko-KR')

/** 날짜 입력 상태를 YYYY-MM-DD 문자열로 변환 */
const formatDate = ({ year, month, day }) =>
  `${year}-${pad2(month)}-${pad2(day)}`

/** 날짜 입력 최소 형식 검증 */
const isValidDateInputs = ({ year, month, day }) =>
  year.length === 4 && month.length >= 1 && day.length >= 1

/** 선택된 멤버에게 total을 균등 분배(앞에서부터 1원씩 나머지 분배) */
const computeEvenAllocation = (total, selectedMembers) => {
  if (!selectedMembers.length) return {}
  const base = Math.floor(total / selectedMembers.length)
  let remainder = total - base * selectedMembers.length
  const allocationByUserId = {}
  for (const member of selectedMembers) {
    allocationByUserId[member.userId] = base + (remainder > 0 ? 1 : 0)
    if (remainder > 0) remainder -= 1
  }
  return allocationByUserId
}

/** 스타일 변수 */
const amountAndTitleInputClass =
  'h-18 w-full rounded-2xl bg-gray-100 px-4 pr-12 text-xl placeholder:text-gray-400 border-none outline-none'
const dateInputClass =
  'h-18 rounded-2xl bg-gray-100 px-0 text-lg text-center placeholder:text-gray-400 border-none outline-none'
const sectionTitleClass = 'mb-2 text-xl text-gray-800'
const dateDotClass = 'self-end text-4xl text-gray-500'

/** 정산 내역 추가 페이지 */
const SettlementAdd = () => {
  const navigate = useNavigate()
  const { tripId, userId } = useParams()

  /** 상단 폼 입력 상태 */
  const [amountInput, setAmountInput] = useState('')
  const [settlementTitle, setSettlementTitle] = useState('')
  const [dateInput, setDateInput] = useState({ year: '', month: '', day: '' })
  const [category, setCategory] = useState('ETC')

  /** 멤버/분배 관련 상태 */
  const [memberList, setMemberList] = useState([])
  const [isLoadingMembers, setIsLoadingMembers] = useState(false)

  const [selectedPayersByUserId, setSelectedPayersByUserId] = useState({})
  const [allocatedByUserId, setAllocatedByUserId] = useState({})
  const [isManualInput, setIsManualInput] = useState(false)
  const [manualAmountByUserId, setManualAmountByUserId] = useState({})
  const [isEvenSplitActive, setIsEvenSplitActive] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)

  /** 현재 페이지 URL 파라미터에서 내 userId */
  const currentUserId = userId ? Number(userId) : null

  /** 여행 멤버 조회 */
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
          Object.fromEntries(
            sortedMembers.map((member) => [member.userId, true]),
          ),
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

  /** 선택된 멤버 & 인원 수 */
  const selectedMembers = useMemo(
    () => memberList.filter((member) => selectedPayersByUserId[member.userId]),
    [memberList, selectedPayersByUserId],
  )
  const selectedCount = selectedMembers.length

  /** 확인 버튼 활성화 */
  const isConfirmEnabled = useMemo(() => {
    const hasTitle = !!settlementTitle.trim()
    const hasAmount = !!amountInput
    const hasDate = !!dateInput.year && !!dateInput.month && !!dateInput.day
    return hasTitle && hasAmount && hasDate && selectedCount > 0
  }, [settlementTitle, amountInput, dateInput, selectedCount])

  /** 뒤로 가기 */
  const handleBack = () => navigate(-1)

  /** 1/n 정산하기 */
  const handleSplitEvenly = useCallback(() => {
    if (!/^\d+$/.test(amountInput))
      return alert('정산 비용에 숫자를 입력해주세요.')
    const total = Number(amountInput)
    if (total <= 0) return alert('정산 비용은 1원 이상이어야 합니다.')
    if (!selectedCount) return alert('정산 인원을 선택해주세요.')

    setIsManualInput(false)
    setIsEvenSplitActive(true)
    setAllocatedByUserId(computeEvenAllocation(total, selectedMembers))
  }, [amountInput, selectedCount, selectedMembers])

  /** 직접입력 모드 */
  const handleManualInputMode = useCallback(() => {
    setIsManualInput(true)
    setIsEvenSplitActive(false)
    setManualAmountByUserId((prevManualAmounts) => {
      const base = Object.keys(allocatedByUserId).length
        ? allocatedByUserId
        : {}
      const nextManualAmounts = { ...prevManualAmounts }
      selectedMembers.forEach((member) => {
        nextManualAmounts[member.userId] =
          base[member.userId] ?? nextManualAmounts[member.userId] ?? ''
      })
      return nextManualAmounts
    })
  }, [allocatedByUserId, selectedMembers])

  /** 멤버 선택 토글 */
  const toggleSelectPayer = useCallback(
    (toggleUserId) => {
      setSelectedPayersByUserId((prevSelectionMap) => {
        const nextSelectionMap = {
          ...prevSelectionMap,
          [toggleUserId]: !prevSelectionMap[toggleUserId],
        }

        if (
          isEvenSplitActive &&
          /^\d+$/.test(amountInput) &&
          Number(amountInput) > 0
        ) {
          const nextSelectedMembers = memberList.filter(
            (member) => nextSelectionMap[member.userId],
          )
          setAllocatedByUserId(
            computeEvenAllocation(Number(amountInput), nextSelectedMembers),
          )
        }

        if (
          isManualInput &&
          nextSelectionMap[toggleUserId] &&
          manualAmountByUserId[toggleUserId] == null
        ) {
          setManualAmountByUserId((prevManualAmounts) => ({
            ...prevManualAmounts,
            [toggleUserId]: '',
          }))
        }

        return nextSelectionMap
      })
    },
    [
      isEvenSplitActive,
      amountInput,
      memberList,
      isManualInput,
      manualAmountByUserId,
    ],
  )

  /** 총액 변경 시 1/n 활성 상태면 재분배 */
  useEffect(() => {
    if (!isEvenSplitActive || isManualInput) return
    if (!/^\d+$/.test(amountInput)) return setAllocatedByUserId({})
    const total = Number(amountInput)
    if (total <= 0) return setAllocatedByUserId({})
    setAllocatedByUserId(computeEvenAllocation(total, selectedMembers))
  }, [amountInput, selectedMembers, isManualInput, isEvenSplitActive])

  /** 수동 입력값 변경 */
  const handleChangeManualAmount = useCallback((userId, value) => {
    setManualAmountByUserId((prevManualAmounts) => ({
      ...prevManualAmounts,
      [userId]: onlyDigits(value),
    }))
  }, [])

  /** 제출 */
  const handleSubmitSettlement = useCallback(async () => {
    if (!tripId || isSubmitting) return

    const name = settlementTitle.trim()
    if (!name) return alert('내역 이름을 입력해주세요.')
    if (!/^\d+$/.test(amountInput)) return alert('금액은 숫자만 입력해주세요.')

    const totalPrice = Number(amountInput)
    if (totalPrice <= 0) return alert('금액은 1원 이상이어야 합니다.')
    if (!isValidDateInputs(dateInput))
      return alert('날짜 형식을 확인해주세요. (YYYY.MM.DD)')
    if (!selectedMembers.length) return alert('정산 인원을 선택해주세요.')

    let payers
    if (isManualInput) {
      const anyInvalid = selectedMembers.some(
        (member) =>
          !/^\d+$/.test(String(manualAmountByUserId[member.userId] ?? '')),
      )
      if (anyInvalid) return alert('직접 입력한 금액에 숫자만 입력해주세요.')
      payers = selectedMembers.map((member) => ({
        userId: member.userId,
        price: Number(manualAmountByUserId[member.userId] || 0),
        isCompleted: true,
      }))
    } else if (isEvenSplitActive) {
      payers = selectedMembers.map((member) => ({
        userId: member.userId,
        price: allocatedByUserId[member.userId] ?? 0,
        isCompleted: true,
      }))
    } else {
      const even = computeEvenAllocation(totalPrice, selectedMembers)
      payers = selectedMembers.map((member) => ({
        userId: member.userId,
        price: even[member.userId],
        isCompleted: true,
      }))
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
    selectedMembers,
    isManualInput,
    manualAmountByUserId,
    isEvenSplitActive,
    allocatedByUserId,
  ])

  const MemberSelectRow = React.memo(function MemberSelectRow({ member }) {
    const isCurrentUser =
      currentUserId != null && member.userId === currentUserId
    const isSelected = !!selectedPayersByUserId[member.userId]
    const allocated = allocatedByUserId[member.userId]
    const showEvenAmount = isEvenSplitActive && isSelected && allocated != null

    return (
      <div className='flex items-center justify-between rounded-xl px-1 py-3'>
        <div className='flex items-center gap-3'>
          <div className='relative h-9 w-9 overflow-hidden rounded-full bg-gray-200'>
            {member.imageUrl ? (
              <img
                src={member.imageUrl}
                alt={`${member.nickname} 프로필 이미지`}
                className='h-full w-full object-cover'
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            ) : null}
          </div>
          <div className='text-base text-gray-800'>
            {isCurrentUser ? '(나) ' : ''}
            {member.nickname}
          </div>
        </div>

        {/* 오른쪽: 금액 또는 체크 버튼 */}
        <div className='flex items-center gap-3'>
          <div className='min-w-[120px] text-right text-gray-800'>
            {isManualInput && isSelected ? (
              <div className='relative'>
                <input
                  type='text'
                  inputMode='numeric'
                  value={manualAmountByUserId[member.userId] ?? ''}
                  onChange={(e) =>
                    handleChangeManualAmount(member.userId, e.target.value)
                  }
                  placeholder='금액입력'
                  className='w-[110px] appearance-none rounded-none border-none bg-transparent px-0 py-1 pr-6 text-right text-sm outline-none focus:ring-0'
                />
                <span className='pointer-events-none absolute top-1/2 right-1 -translate-y-1/2 text-sm text-gray-500'>
                  원
                </span>
              </div>
            ) : showEvenAmount ? (
              `${formatWon(allocated)}원`
            ) : (
              ''
            )}
          </div>

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
              onChange={(e) => setAmountInput(onlyDigits(e.target.value))}
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
                  year: onlyDigits(e.target.value),
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
                  month: onlyDigits(e.target.value),
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
                  day: onlyDigits(e.target.value),
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
          {/* 여행 멤버 보이기 */}
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
