import { useContext } from 'react'
import AuthContext from '@/contexts/AuthContext'

/**인증과 관련된 정보를 다른 컴포넌트에서 쉽게 접근하도록 하는 커스텀 훅 */
const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth 불러오기 실패')
  }
  return context
}

export default useAuth
