import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PrimeHubLogo from '../assets/primehub_title.png'
import { FaGoogle, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export default function LoginAuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if(!email || !password) {
      setStatus('error');
      setMessage("Please fill in all fields");
      setLoading(false);
      setTimeout(() => {
        setStatus('idle')
        setMessage('');
      }, 4000)
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
        credentials: 'include'
      })

      const data = await res.json();

      if(data.success) {
        setStatus('success');
        setMessage(data.message || 'Logged in successfully! 🎉');
        setEmail('');
        setPassword('');

        setTimeout(() => {
          navigate('/dashboard')
        }, 3000)
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong');
         setTimeout(() => {
        setStatus('idle')
        setMessage('');
      }, 4000)
      }
      
    } catch (error) {
      console.error('Login failed:', error);
      setStatus('error');
      setMessage('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/google'
  }

  return (
    <>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition"
              required
            />

            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}     
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

            {/* ✅ Success Message */}
            {status === 'success' && message && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <FaCheckCircle className="text-green-500 flex-shrink-0" size={18} />
                <p className="text-green-700 text-sm font-medium">{message}</p>
              </div>
            )}

            
            {status === 'error' && message && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <FaExclamationCircle className="text-red-500 flex-shrink-0" size={18} />
                <p className="text-red-600 text-sm font-medium">{message}</p>
              </div>
            )}

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
              className="flex items-center justify-center gap-3 p-3 border border-black rounded-lg hover:bg-black hover:text-white transition cursor-pointer"
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