import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AdminProtectedRoute({children}) {
  const [isAuth, setIsAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminCheckAuth = async () => {
      try {

       const res = await fetch("/api/auth/admin", {
        credentials: 'include'
       })

       if(res.ok) {
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

    adminCheckAuth()
  }, [])


  if(loading) {
    return <div className="text-center py-20">Loading...</div>
  }

  if (!isAuth) {
    return <Navigate to="/admin/login" replace />
  }

  return children;
}