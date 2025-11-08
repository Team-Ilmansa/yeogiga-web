/** 닉네임 앞 두 글자(없으면 'user') */
export const getInitials = (nickname = '') => {
  const v = nickname.trim()
  if (!v) return 'user'
  return v.slice(0, 2).toUpperCase()
}

/** 닉네임 HSL 색 */
export const getStableColor = (name = '') => {
  const n = name.trim().toLowerCase()
  if (!n) return 'hsl(0, 0%, 100%)'
  let hash = 0
  for (let i = 0; i < n.length; i++) {
    hash = n.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 70%, 55%)`
}

/** 배경색에 따른 텍스트 색상 */
export const textColorForBg = (hsl) => {
  const m = /hsl\((\d+),\s*(\d+)%\s*,\s*(\d+)%\)/i.exec(hsl)
  if (!m) return '#fff'
  const L = Number(m[3]) / 100
  return L > 0.6 ? '#111' : '#fff'
}

/** 닉네임 기반 원형 아바타 SVG 문자열 */
export const createAvatarSvg = ({
  nickname = '',
  size = 256,
  fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, "Noto Sans KR", sans-serif',
} = {}) => {
  const initials = getInitials(nickname)
  const bg = getStableColor(nickname)
  const fg = textColorForBg(bg)
  const fontSize = Math.round(size * 0.28)
  const cx = size / 2

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${initials}">
  <defs>
    <style>
      .t {
        font: ${fontSize}px ${fontFamily};
        font-weight: 700;
        text-anchor: middle;
        dominant-baseline: middle;
      }
    </style>
  </defs>
  <circle cx="${cx}" cy="${cx}" r="${cx}" fill="${bg}"/>
  <g transform="translate(${cx} ${cx})">
    <text class="t" fill="${fg}" dy=".04em">${initials}</text>
  </g>
</svg>`.trim()
}

export const getAvatarDataUrl = ({
  nickname = '',
  size = 256,
  fontFamily,
} = {}) => {
  const svg = createAvatarSvg({ nickname, size, fontFamily })
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22')
  return `data:image/svg+xml;charset=utf-8,${encoded}`
}
