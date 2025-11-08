import { getAvatarDataUrl } from './avatar'

/** 단일 사용자 객체 표준화 */
export const normalizeUser = (u, { avatarSize = 256 } = {}) => {
  if (!u || typeof u !== 'object') return u
  const hasNickname = typeof u.nickname === 'string' && u.nickname.trim() !== ''
  const hasImage = !!u.imageUrl
  if (!hasImage && hasNickname) {
    u.imageUrl = getAvatarDataUrl({ nickname: u.nickname, size: avatarSize })
  }
  return u
}
/** 모든 사용자 객체 표준화 */
export const deepNormalizeUsers = (data, opts = {}) => {
  const seen = new WeakSet()

  const walk = (node) => {
    if (node && typeof node === 'object') {
      if (seen.has(node)) return node
      seen.add(node)

      if ('nickname' in node) normalizeUser(node, opts)

      if (Array.isArray(node)) {
        for (let i = 0; i < node.length; i++) {
          node[i] = walk(node[i])
        }
      } else {
        for (const k of Object.keys(node)) {
          node[k] = walk(node[k])
        }
      }
    }
    return node
  }

  return walk(data)
}
