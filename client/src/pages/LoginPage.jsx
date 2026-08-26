import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PrimeHubLogo from '../assets/primehub_title.png'
import Button from "../components/Button";
import { FaGoogle } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
     
      navigate('/')
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google'
  }

  return (
    <>
    <Helmet>
  <title>Login - PrimeHub</title>
</Helmet>
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Logo */}
          <img 
            className="w-35 mx-auto" 
            src={PrimeHubLogo} 
            alt="Primehub Logo" 
          />
          
          <p className="text-center text-gray-600 text-sm mb-4">
            Login to your curated shopping experience
          </p>

         
          <input 
            type="email" 
            placeholder="Enter email address" 
           
            
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition"
            required
          />

         
          <input 
            type="password" 
            placeholder="Password"     
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition"
            required
          />
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-black">
              Forgot password?
            </Link>
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="p-3 cursor-pointer text-white bg-black rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login to account'}
          </button>

        
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

         
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 p-3 border border-black rounded-lg  cursor-pinter transition"
          >
            <FaGoogle />
            Sign in with Google
          </button>

        
          <p className="text-center text-sm text-gray-600 mt-2">
            Don't have an account?{' '}
            <Link to="/register" className="text-black font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
    </>
  )
}