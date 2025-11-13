/**아이디 마스킹 유틸 */
export function maskUsername(username, options = {}) {
  if (!username || typeof username !== 'string') return ''

  const { visibleStart = 2, visibleEnd = 2, maskChar = '*' } = options

  const mask = (s) => {
    const len = s.length
    if (len <= visibleStart) return s[0] + maskChar.repeat(Math.max(len - 1, 0))
    if (len <= visibleStart + visibleEnd) {
      const start = s.slice(0, visibleStart)
      return start + maskChar.repeat(Math.max(len - visibleStart, 0))
    }
    const start = s.slice(0, visibleStart)
    const end = s.slice(-visibleEnd)
    const maskedLen = Math.max(len - visibleStart - visibleEnd, 0)
    return `${start}${maskChar.repeat(maskedLen)}${end}`
  }

  const at = username.indexOf('@')
  if (at > 0) {
    const local = username.slice(0, at)
    const domain = username.slice(at)
    return `${mask(local)}${domain}`
  }

  return mask(username)
}
