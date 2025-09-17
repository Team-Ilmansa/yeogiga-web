import GoBack from '@/assets/sign-up/GoBack'
import FixedActionBar from '@/components/common/FixedActionBar'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import readMemberApi from '@/apis/member/readMemberApi'
import createSettlementApi from '@/apis/account-book/createSettlementApi'
import CategorySelector, {
  toServerType,
} from '@/components/common/CategorySelector'

const pad = (v, len = 2) => String(v).padStart(len, '0')

const AccountAdd = () => {
  const navigate = useNavigate()
  const { tripId, userId } = useParams()

  const [amount, setAmount] = useState('')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState({ y: '', m: '', d: '' })
  const [category, setCategory] = useState('ETC')

  const [members, setMembers] = useState([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [selected, setSelected] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const meId = Number(userId)

  useEffect(() => {
    let mounted = true
    const fetchMembers = async () => {
      if (!tripId) return
      try {
        setLoadingMembers(true)
        const res = await readMemberApi(tripId)
        const list = res?.data ?? []
        if (!mounted) return

        const sorted = [...list].sort((a, b) => {
          if (a.userId === meId) return -1
          if (b.userId === meId) return 1
          return a.nickname.localeCompare(b.nickname, 'ko')
        })
        setMembers(sorted)

        const sel = {}
        sorted.forEach((m) => (sel[m.userId] = true))
        setSelected(sel)
      } catch (e) {
        alert(e.message || '여행 멤버를 불러오지 못했습니다.')
      } finally {
        setLoadingMembers(false)
      }
    }
    fetchMembers()
    return () => {
      mounted = false
    }
  }, [tripId, meId])

  const isConfirmEnabled = useMemo(() => {
    const basicOk =
      !!title.trim() && !!amount && !!date.y && !!date.m && !!date.d
    if (!basicOk) return false
    const hasAnySelected = members.some((m) => selected[m.userId])
    return hasAnySelected
  }, [title, amount, date, members, selected])

  const handleBack = () => navigate(-1)

  const handleConfirm = useCallback(async () => {
    if (!tripId || isSubmitting) return
    const name = title.trim()
    const y = date.y.trim()
    const m = date.m.trim()
    const d = date.d.trim()

    if (!name) return alert('내역 이름을 입력해주세요.')
    if (!/^\d+$/.test(amount)) return alert('금액은 숫자만 입력해주세요.')

    const totalPrice = Number(amount)
    if (totalPrice <= 0) return alert('금액은 1원 이상이어야 합니다.')
    if (!(y.length === 4 && m.length >= 1 && d.length >= 1)) {
      return alert('날짜 형식을 확인해주세요. (YYYY.MM.DD)')
    }

    const yyyyMMdd = `${y}-${pad(m, 2)}-${pad(d, 2)}`
    const selectedMembers = members.filter((m) => selected[m.userId])
    if (selectedMembers.length === 0) return alert('정산 인원을 선택해주세요.')

    const n = selectedMembers.length
    const base = Math.floor(totalPrice / n)
    let remainder = totalPrice - base * n

    const payers = selectedMembers.map((mItem) => {
      const price = base + (remainder > 0 ? 1 : 0)
      if (remainder > 0) remainder -= 1
      return { userId: mItem.userId, price, isCompleted: true }
    })

    const serverType = toServerType(category)
    if (!serverType) {
      return alert('지원하지 않는 카테고리입니다.')
    }

    const body = {
      name,
      totalPrice,
      date: yyyyMMdd,
      type: serverType,
      payers,
    }
    /**정산 내역 생성하기 API 호출*/
    try {
      setIsSubmitting(true)
      const response = await createSettlementApi(tripId, body)
      console.log(response)
      alert('정산 내역이 등록되었습니다.')
    } catch (err) {
      alert(err.message || '정산 내역 등록에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }, [tripId, title, amount, date, category, members, selected, isSubmitting])

  const inputStyle =
    'h-18 w-full rounded-2xl bg-gray-100 px-4 pr-12 text-xl placeholder:text-gray-400 border-none outline-none'
  const dateInputStyle =
    'h-18 rounded-2xl bg-gray-100 px-0 text-lg text-center placeholder:text-gray-400 border-none outline-none'
  const titleStyle = 'mb-2 text-xl text-gray-800'
  const dotStyle = 'self-end text-4xl text-gray-500'

  const MemberRow = ({ member }) => {
    const isMe = member.userId === meId
    const isSelected = !!selected[member.userId]
    const toggleSelect = () =>
      setSelected((prevSelected) => ({
        ...prevSelected,
        [member.userId]: !prevSelected[member.userId],
      }))

    return (
      <div
        className='flex items-center justify-between rounded-xl px-1 py-3'
        key={member.userId}
      >
        <div className='flex items-center gap-3'>
          <div className='relative h-9 w-9 overflow-hidden rounded-full bg-gray-200'>
            {member.imageUrl ? (
              <img
                src={member.imageUrl}
                alt={`${member.nickname} 프로필`}
                className='h-full w-full object-cover'
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : null}
          </div>
          <div className='text-base text-gray-800'>
            {isMe ? '(나) ' : ''}
            {member.nickname}
          </div>
        </div>

        {/* 체크 버튼 */}
        <button
          onClick={toggleSelect}
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
    )
  }

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
          <div className={titleStyle}>정산 비용</div>
          <div className='relative'>
            <input
              type='text'
              inputMode='numeric'
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder='금액을 입력해주세요'
              className={inputStyle}
            />
            <span className='pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xl text-gray-500'>
              원
            </span>
          </div>
        </div>

        {/* 내역 이름 */}
        <div>
          <div className={titleStyle}>내역 이름</div>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='내역 이름을 입력해주세요'
            className={inputStyle}
          />
        </div>

        {/* 날짜 */}
        <div>
          <div className={titleStyle}>날짜</div>
          <div className='flex items-center gap-2'>
            <input
              type='text'
              inputMode='numeric'
              maxLength={4}
              placeholder='YYYY'
              value={date.y}
              onChange={(e) =>
                setDate((prevDate) => ({
                  ...prevDate,
                  y: e.target.value.replace(/[^0-9]/g, ''),
                }))
              }
              className={`${dateInputStyle} w-28`}
            />
            <span className={dotStyle}>.</span>
            <input
              type='text'
              inputMode='numeric'
              maxLength={2}
              placeholder='MM'
              value={date.m}
              onChange={(e) =>
                setDate((prevDate) => ({
                  ...prevDate,
                  m: e.target.value.replace(/[^0-9]/g, ''),
                }))
              }
              className={`${dateInputStyle} w-20`}
            />
            <span className={dotStyle}>.</span>
            <input
              type='text'
              inputMode='numeric'
              maxLength={2}
              placeholder='DD'
              value={date.d}
              onChange={(e) =>
                setDate((prevDate) => ({
                  ...prevDate,
                  d: e.target.value.replace(/[^0-9]/g, ''),
                }))
              }
              className={`${dateInputStyle} w-20`}
            />
          </div>
        </div>

        {/* 카테고리 */}
        <div className={titleStyle}>카테고리</div>
        <CategorySelector value={category} onChange={setCategory} size={50} />

        {/* 정산 인원 */}
        <div className='mt-4'>
          <div className='mb-2 flex items-center justify-between pr-3'>
            <div className='text-xl text-gray-800'>정산 인원</div>
            <div className='flex items-center gap-2'>
              <button
                type='button'
                className='text-m rounded-full border border-gray-200 px-3 py-1 text-[var(--Blue-Scale-blue-500)]'
              >
                1/n 정산하기
              </button>
              <button
                type='button'
                className='text-m rounded-full border border-gray-200 px-3 py-1 text-gray-700'
              >
                직접입력
              </button>
            </div>
          </div>

          <div className='px-3 py-1'>
            {loadingMembers ? (
              <div className='px-2 py-6 text-center text-gray-500'>
                멤버를 불러오는 중…
              </div>
            ) : members.length === 0 ? (
              <div className='px-2 py-6 text-center text-gray-500'>
                여행 멤버가 없습니다.
              </div>
            ) : (
              members.map((member) => (
                <MemberRow key={member.userId} member={member} />
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
            onClick={handleConfirm}
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

export default AccountAdd
