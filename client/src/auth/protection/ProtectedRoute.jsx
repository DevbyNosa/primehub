
import { Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
       
        const res = await fetch('/api/auth/me', {
          credentials: 'include'
        })

        if (res.ok) {
          setIsAuth(true)
        } else {
          setIsAuth(false)
        }
      } catch (error) {
        setIsAuth(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return <div className="text-center py-20">Loading...</div>
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />
  }

  return children
}