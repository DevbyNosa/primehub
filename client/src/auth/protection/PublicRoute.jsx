import { Navigate } from 'react-router-dom'
import { useAuth } from '../../components/context/AuthContext'

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="text-center py-20">Loading...</div>
  }

  //  If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}