import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import SflashScreen from '@/pages/SflashScreen'

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <SflashScreen />
  if (!user)
    return <Navigate to={`/signin?redirect=${location.pathname}`} replace />

  return <Outlet />
}

export default ProtectedRoute
