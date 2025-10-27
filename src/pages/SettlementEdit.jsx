import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import GoBack from '@/assets/sign-up/GoBack'
import FixedActionBar from '@/components/common/FixedActionBar'
import CategorySelector from '@/components/common/CategorySelector'

import readMemberApi from '@/apis/member/readMemberApi'
import readSettlementApi from '@/apis/settlement/readSettlementApi'
import putSettlementApi from '@/apis/settlement/putSettlementApi'
import useAuth from '@/hooks/useAuth'
import SettlementEditModal from '@/components/settlement/modal/SettlementEditModal'

const pad2 = (v) => String(v).padStart(2, '0')
const onlyDigits = (v) => String(v).replace(/[^0-9]/g, '')
const formatWon = (n) => Number(n || 0).toLocaleString('ko-KR')
const formatDate = ({ y, m, d }) => `${y}-${pad2(m)}-${pad2(d)}`
const parseDate = (yyyymmdd) => {
  const [y, m, d] = (yyyymmdd || '').split('-')
  return { y: y || '', m: m || '', d: d || '' }
}

const isValidDateInputs = ({ y, m, d }) =>
  String(y).length === 4 && String(m).length >= 1 && String(d).length >= 1

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

const inputStyle =
  'h-18 w-full rounded-2xl bg-gray-100 px-4 pr-12 text-xl placeholder:text-gray-400 border-none outline-none'
const sectionTitleClass = 'mb-2 text-xl text-gray-800'
const dateInputClass =
  'h-18 rounded-2xl bg-gray-100 px-0 text-lg text-center placeholder:text-gray-400 border-none outline-none'
const dotStyle = 'self-end text-4xl text-gray-500'

const MemberSelectRow = React.memo(function MemberSelectRow({
  member,
  isCurrentUser,
  isSelected,
  isManualInput,
  allocated,
  value = '',
  onChange,
  onToggle,
}) {
  const showEvenAmount = !isManualInput && isSelected && allocated != null
  const handleOnChange = useCallback(
    (e) => onChange(member.userId, e.target.value),
    [onChange, member.userId],
  )
  const handleOnToggle = useCallback(
    () => onToggle(member.userId),
    [onToggle, member.userId],
  )

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

      <div className='flex items-center gap-3'>
        <div className='min-w-[120px] text-right text-gray-800'>
          {isManualInput && isSelected ? (
            <div className='relative'>
              <input
                type='text'
                inputMode='numeric'
                autoComplete='off'
                pattern='[0-9]*'
                value={value}
                onChange={handleOnChange}
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
          type='button'
          onClick={handleOnToggle}
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

const SettlementEdit = () => {
  const navigate = useNavigate()
  const { tripId, settlementId } = useParams()
  const { user } = useAuth()
  const currentUserId = user?.userId

  const [amount, setAmount] = useState('')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState({ y: '', m: '', d: '' })
  const [category, setCategory] = useState('ETC')

  const [memberList, setMemberList] = useState([])
  const [isLoadingMembers, setIsLoadingMembers] = useState(false)

  const [selectedPayersByUserId, setSelectedPayersByUserId] = useState({})
  const [allocatedByUserId, setAllocatedByUserId] = useState({})
  const [isManualInput, setIsManualInput] = useState(false)
  const [manualAmountByUserId, setManualAmountByUserId] = useState({})
  const [isEvenSplitActive, setIsEvenSplitActive] = useState(false)

  const [isLoadingDetail, setIsLoadingDetail] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [pendingBody, setPendingBody] = useState(null)

  useEffect(() => {
    let mounted = true
    const run = async () => {
      try {
        setIsLoadingMembers(true)
        const result = await readMemberApi(tripId)
        const members = result.data ?? []
        if (!mounted) return

        const sorted = [...members].sort((a, b) => {
          if (currentUserId != null) {
            if (a.userId === currentUserId) return -1
            if (b.userId === currentUserId) return 1
          }
          return a.nickname.localeCompare(b.nickname, 'ko')
        })
        setMemberList(sorted)
      } catch (e) {
        alert(e.message || '여행 멤버를 불러오지 못했습니다.')
      } finally {
        mounted && setIsLoadingMembers(false)
      }
    }
    if (tripId) run()
    return () => (mounted = false)
  }, [tripId, currentUserId])

  useEffect(() => {
    let mounted = true
    const run = async () => {
      if (!tripId || !settlementId) return
      try {
        setIsLoadingDetail(true)
        const data = await readSettlementApi(tripId, settlementId)
        if (!mounted) return

        const {
          name,
          totalPrice,
          date: ymd,
          type,
          payers = [],
        } = data?.data ?? data

        setTitle(name ?? '')
        setAmount(String(totalPrice ?? ''))
        setDate(parseDate(ymd ?? ''))
        setCategory(type ?? 'ETC')

        const selected = {}
        const manual = {}
        payers.forEach((p) => {
          selected[p.userId] = true
          manual[p.userId] = String(p.price ?? '')
        })
        setSelectedPayersByUserId(selected)
        setManualAmountByUserId(manual)
        setIsManualInput(true)
        setIsEvenSplitActive(false)
        setAllocatedByUserId({})
      } catch (e) {
        alert(e.message || '정산 내역을 불러올 수 없습니다.')
        navigate(-1)
      } finally {
        mounted && setIsLoadingDetail(false)
      }
    }
    run()
    return () => (mounted = false)
  }, [tripId, settlementId, navigate])

  const selectedMembers = useMemo(
    () => memberList.filter((m) => selectedPayersByUserId[m.userId]),
    [memberList, selectedPayersByUserId],
  )
  const selectedCount = selectedMembers.length

  const isConfirmEnabled = useMemo(() => {
    const hasTitle = !!title.trim()
    const hasAmount = !!amount
    const hasDate = !!date.y && !!date.m && !!date.d
    const hasPayers = selectedCount > 0
    return hasTitle && hasAmount && hasDate && hasPayers
  }, [title, amount, date, selectedCount])

  const handleBack = () => navigate(-1)

  const handleSplitEvenly = useCallback(() => {
    if (!/^\d+$/.test(amount)) return alert('정산 비용에 숫자를 입력해주세요.')
    const total = Number(amount)
    if (total <= 0) return alert('정산 비용은 1원 이상이어야 합니다.')
    if (!selectedCount) return alert('정산 인원을 선택해주세요.')

    setIsManualInput(false)
    setIsEvenSplitActive(true)
    setAllocatedByUserId(computeEvenAllocation(total, selectedMembers))
  }, [amount, selectedCount, selectedMembers])

  const handleManualInputMode = useCallback(() => {
    setIsManualInput(true)
    setIsEvenSplitActive(false)
    setManualAmountByUserId((prev) => {
      const base = Object.keys(allocatedByUserId).length
        ? allocatedByUserId
        : {}
      const next = { ...prev }
      selectedMembers.forEach((m) => {
        next[m.userId] = base[m.userId] ?? next[m.userId] ?? ''
      })
      return next
    })
  }, [allocatedByUserId, selectedMembers])

  const toggleSelectPayer = useCallback(
    (toggleUserId) => {
      setSelectedPayersByUserId((prev) => {
        const id = String(toggleUserId)
        const next = { ...prev, [id]: !prev[id] }

        if (isEvenSplitActive && /^\d+$/.test(amount) && Number(amount) > 0) {
          const nextSelectedMembers = memberList.filter(
            (m) => next[String(m.userId)],
          )
          setAllocatedByUserId(
            computeEvenAllocation(Number(amount), nextSelectedMembers),
          )
        }

        if (isManualInput && next[id]) {
          setManualAmountByUserId((prevManual) =>
            prevManual[id] != null ? prevManual : { ...prevManual, [id]: '' },
          )
        }
        return next
      })
    },
    [isEvenSplitActive, amount, memberList, isManualInput],
  )

  useEffect(() => {
    if (!isEvenSplitActive || isManualInput) return
    if (!/^\d+$/.test(amount)) return setAllocatedByUserId({})
    const total = Number(amount)
    if (total <= 0) return setAllocatedByUserId({})
    setAllocatedByUserId(computeEvenAllocation(total, selectedMembers))
  }, [amount, selectedMembers, isManualInput, isEvenSplitActive])

  const handleChangeManualAmount = useCallback((userId, value) => {
    setManualAmountByUserId((prev) => ({
      ...prev,
      [userId]: onlyDigits(value),
    }))
  }, [])

  const handleUpdateSettlement = useCallback(() => {
    if (!tripId || !settlementId || isSubmitting) return

    const name = title.trim()
    if (!name) return alert('내역 이름을 입력해주세요.')
    if (!/^\d+$/.test(amount)) return alert('금액은 숫자만 입력해주세요.')

    const totalPrice = Number(amount)
    if (totalPrice <= 0) return alert('금액은 1원 이상이어야 합니다.')
    if (!isValidDateInputs(date))
      return alert('날짜 형식을 확인해주세요. (YYYY.MM.DD)')
    if (!selectedMembers.length) return alert('정산 인원을 선택해주세요.')

    let payers
    if (isManualInput) {
      const anyInvalid = selectedMembers.some(
        (m) => !/^\d+$/.test(String(manualAmountByUserId[m.userId] ?? '')),
      )
      if (anyInvalid) return alert('직접 입력한 금액에 숫자만 입력해주세요.')
      payers = selectedMembers.map((m) => ({
        userId: m.userId,
        price: Number(manualAmountByUserId[m.userId] || 0),
        isCompleted: false,
      }))
    } else if (isEvenSplitActive) {
      payers = selectedMembers.map((m) => ({
        userId: m.userId,
        price: allocatedByUserId[m.userId] ?? 0,
        isCompleted: false,
      }))
    } else {
      const even = computeEvenAllocation(Number(amount), selectedMembers)
      payers = selectedMembers.map((m) => ({
        userId: m.userId,
        price: even[m.userId],
        isCompleted: false,
      }))
    }

    const body = {
      name,
      totalPrice,
      date: formatDate(date),
      type: category,
      payers,
    }

    setPendingBody(body)
    setIsConfirmOpen(true)
  }, [
    tripId,
    settlementId,
    isSubmitting,
    title,
    amount,
    date,
    category,
    selectedMembers,
    isManualInput,
    manualAmountByUserId,
    isEvenSplitActive,
    allocatedByUserId,
  ])

  const handleConfirmUpdate = useCallback(async () => {
    if (!pendingBody || !tripId || !settlementId) return
    try {
      setIsSubmitting(true)
      await putSettlementApi(tripId, settlementId, pendingBody)
      alert('정산 내역이 수정되었습니다.')
      navigate(-1)
    } catch (e) {
      alert(e.message || '정산 내역 수정에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
      setIsConfirmOpen(false)
    }
  }, [pendingBody, tripId, settlementId, navigate])

  return (
    <div className='flex w-full flex-col pt-5'>
      <div className='relative mb-5 flex items-center px-8'>
        <button
          className='border-none bg-transparent p-0'
          onClick={handleBack}
          aria-label='뒤로가기'
        >
          <GoBack />
        </button>
        <div className='absolute left-1/2 -translate-x-1/2 text-lg font-semibold text-gray-800'>
          정산 내역 수정하기
        </div>
      </div>

      <div className='space-y-6 px-10'>
        {isLoadingDetail ? (
          <div className='py-12 text-center text-gray-500'>
            내역을 불러오는 중…
          </div>
        ) : (
          <>
            <div>
              <div className={sectionTitleClass}>정산 비용</div>
              <div className='relative'>
                <input
                  type='text'
                  inputMode='numeric'
                  value={amount}
                  onChange={(e) => setAmount(onlyDigits(e.target.value))}
                  placeholder='금액을 입력해주세요'
                  className={inputStyle}
                />
                <span className='pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xl text-gray-500'>
                  원
                </span>
              </div>
            </div>

            <div>
              <div className={sectionTitleClass}>내역 이름</div>
              <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='내역 이름을 입력해주세요'
                className={inputStyle}
              />
            </div>

            <div>
              <div className={sectionTitleClass}>날짜</div>
              <div className='flex items-center gap-2'>
                <input
                  type='text'
                  inputMode='numeric'
                  maxLength={4}
                  placeholder='YYYY'
                  value={date.y}
                  onChange={(e) =>
                    setDate((p) => ({ ...p, y: onlyDigits(e.target.value) }))
                  }
                  className={`${dateInputClass} w-28`}
                />
                <span className={dotStyle}>.</span>
                <input
                  type='text'
                  inputMode='numeric'
                  maxLength={2}
                  placeholder='MM'
                  value={date.m}
                  onChange={(e) =>
                    setDate((p) => ({ ...p, m: onlyDigits(e.target.value) }))
                  }
                  className={`${dateInputClass} w-20`}
                />
                <span className={dotStyle}>.</span>
                <input
                  type='text'
                  inputMode='numeric'
                  maxLength={2}
                  placeholder='DD'
                  value={date.d}
                  onChange={(e) =>
                    setDate((p) => ({ ...p, d: onlyDigits(e.target.value) }))
                  }
                  className={`${dateInputClass} w-20`}
                />
              </div>
            </div>

            <div>
              <div className={sectionTitleClass}>카테고리</div>
              <CategorySelector
                value={category}
                onChange={setCategory}
                size={50}
              />
            </div>

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
                  memberList.map((member) => {
                    const uid = String(member.userId)
                    const isSelected = !!selectedPayersByUserId[uid]
                    const allocated = allocatedByUserId[uid]
                    const value = manualAmountByUserId[uid] ?? ''
                    return (
                      <MemberSelectRow
                        key={uid}
                        member={member}
                        isCurrentUser={
                          currentUserId != null &&
                          member.userId === currentUserId
                        }
                        isSelected={isSelected}
                        isManualInput={isManualInput}
                        allocated={allocated}
                        value={value}
                        onChange={handleChangeManualAmount}
                        onToggle={toggleSelectPayer}
                      />
                    )
                  })
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <FixedActionBar className='flex justify-center'>
        <div className='flex w-4xl items-center justify-center rounded-t-[20px] bg-white p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
          <button
            disabled={!isConfirmEnabled || isSubmitting || isLoadingDetail}
            onClick={handleUpdateSettlement}
            className={`w-full rounded-lg border-none p-[20px] text-2xl text-white ${
              isConfirmEnabled && !isLoadingDetail
                ? 'bg-[var(--Blue-Scale-blue-500)]'
                : 'cursor-not-allowed bg-gray-300'
            }`}
          >
            {isSubmitting ? '확인 중…' : '확인'}
          </button>
        </div>
      </FixedActionBar>

      <SettlementEditModal
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmUpdate}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

export default SettlementEdit
