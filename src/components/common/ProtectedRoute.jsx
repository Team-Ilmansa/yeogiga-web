import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) return <div>로딩 중...</div>
  if (!user) return <Navigate to='/signin' replace />

  return <Outlet />
}

export default ProtectedRoute
