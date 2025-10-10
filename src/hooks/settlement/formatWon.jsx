export const formatWon = (n) =>
  new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 }).format(
    Number(n) || 0,
  )
