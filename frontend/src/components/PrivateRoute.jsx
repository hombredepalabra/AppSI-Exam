import { Navigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'

export default function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (role && user.rol !== role) {
    return <Navigate to="/dashboard" />
  }

  return children
}
