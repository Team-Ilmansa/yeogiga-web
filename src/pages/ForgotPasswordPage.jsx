import ForgotPasswordRequestForm from '@/components/sign-up/forgot-password/ForgotPasswordRequestForm'
import ResetPasswordForm from '@/components/sign-up/forgot-password/ResetPasswordForm'
import { useSearchParams } from 'react-router-dom'

/** 비밀번호 초기화 페이지 */
const ForgotPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')

  if (code) {
    return <ResetPasswordForm code={code} />
  }

  return <ForgotPasswordRequestForm />
}

export default ForgotPasswordPage
