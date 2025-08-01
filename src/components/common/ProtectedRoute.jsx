import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import SflashScreen from '@/pages/SflashScreen'

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) return <SflashScreen />
  if (!user) return <Navigate to='/signin' replace />

  return <Outlet />
}

export default ProtectedRoute
