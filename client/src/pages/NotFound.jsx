// client/src/pages/NotFound.jsx
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NotFound = () => {
  const [notFoundMsg, setNotFoundMsg] = useState("Page not found")
  const location = useLocation()

  useEffect(() => {
    const fetch404Message = async () => {
      try {
        
        const response = await fetch("/api/404")
        
        const data = await response.json()
        
        
        setNotFoundMsg(data.message || "Page not found")
        
      } catch (error) {
      
        console.error('Network error:', error)
        setNotFoundMsg("The page you're looking for doesn't exist")
      }
    }
    
    fetch404Message()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-black">404</h1>
        <p className="text-xl mt-4 text-gray-700">{notFoundMsg}</p>
        <p className="text-sm text-gray-500 mt-2">
          Path: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{location.pathname}</span>
        </p>
        <Link 
          to="/" 
          className="inline-block mt-6 bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound