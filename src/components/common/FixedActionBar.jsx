import { createPortal } from 'react-dom'

/**버튼 하단 고정을 위한 컴포넌트 */
const FixedActionBar = ({ children, className = '' }) => {
  return createPortal(
    <div className={`fixed inset-x-0 bottom-0 z-50 ${className}`}>
      {children}
    </div>,
    document.body,
  )
}

export default FixedActionBar
