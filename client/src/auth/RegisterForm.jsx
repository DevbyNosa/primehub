import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PrimeHubLogo from '../assets/primehub_title.png'
import Button from "../components/Button";
import { FaGoogle } from "react-icons/fa";


 export default function RegisterAuthForm() {
 const [email, setEmail] = useState('');
 const [name, setName] = useState('');
 const [password, setPassword] = useState('');
 const [number, setNumber] = useState('');
 const [status, setStatus] = useState('');
 const [message, setMessage] = useState('');
 const [loading, setLoading] = useState(false);
 
 const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if(!email || !name || !password || !number) {
        setStatus('error');
        setMessage("Please fill in all fields");
        setLoading(false);
         setTimeout(() => {
        setStatus('idle')
        setMessage('');
    }, 4000)
        return;
    }

      if(number.length < 11 || number.length > 11) {
        setStatus('error');
        setMessage("Phone number must be 11 digits");
        setLoading(false);
         setTimeout(() => {
        setStatus('idle')
        setMessage('');
    }, 4000)
        return;
      }

      if(password.length < 6) {
        setStatus('error');
        setMessage("Password must be above 6 characters");
        setTimeout(() => {
        setStatus('idle')
        setMessage('');

          }, 4000)

        return;
      } else if (password.length > 100) {
        setStatus('error');
        setMessage("Password must be below 100 characters");
        setTimeout(() => {
        setStatus('idle')
        setMessage('');
    }, 4000)
        return;
      }
    try {
        const res = await fetch("/api/auth/register", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({name,email, number, password }),
          credentials: 'include'
        })

        const data = await res.json();

        if(data.success) {
          setStatus('success')
          setMessage(data.message);
          setName('');
          setEmail('');
          setNumber('')
          setPassword('');
          navigate("/dashboard")
        } else {
          setStatus('error');
          setMessage(data.message || 'Something went wrong');
        }

        
    } catch (error) {
      console.error('Login failed:', error);
      setMessage('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }

    setTimeout(() => {
        setStatus('idle')
        setMessage('');
    }, 4000)
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
            Register an account to your curated shopping experience
          </p>
          
          <input value={name} onChange={((e) => setName(e.target.value))} type="text" placeholder="Full name"  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition"
            required />
         
          <input 
            type="email" 
            value={email}
            placeholder="Enter email address" 
            onChange={((e) => setEmail(e.target.value))}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition"
            required
          />

          <div className="flex gap-2">
            <select name="country" id="country" className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition">
              <option value="Nigeria">Nigeria</option>
            </select>
            <input type="tel" value={number} onChange={((e) => setNumber(e.target.value))}
              placeholder="08012345678" className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition w-full" required/>
          </div>

         
          <input 
            type="password" 
            onChange={((e) => setPassword(e.target.value))}
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
            {loading ? 'Registering...' : 'Register an account'}
          </button>

          {message && (
            <p className={`mt-3 ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>{message}</p>
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
            className="flex items-center justify-center gap-3 p-3 border border-black rounded-lg  cursor-pinter transition cursor-pointer"
          >
            <FaGoogle />
            Sign up with Google
          </button>

        
          <p className="text-center text-sm text-gray-600 mt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-black font-semibold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
    </>
  )
}