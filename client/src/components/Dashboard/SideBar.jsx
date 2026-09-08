import { Link, useLocation, useNavigate } from "react-router-dom"
import { FaUser, FaShoppingBag, FaHeart, FaCog, FaSignOutAlt, FaHome } from 'react-icons/fa'
import { useState } from "react"

export default function SideBar() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { path: '/dashboard', icon: FaUser, label: 'Dashboard' },
    { path: '/dashboard/orders', icon: FaShoppingBag, label: 'Orders' },
    { path: '/dashboard/wishlist', icon: FaHeart, label: 'Wishlist' },
    { path: '/dashboard/settings', icon: FaCog, label: 'Settings' },
  ]

  const isActive = (path) => location.pathname === path;

  async function handleLogout(e) {
    e.preventDefault();
    setLoading(true);

    try {
       const res = await fetch("/api/logout", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'  
      });
        const data = await res.json();
      if(data.success) {
        navigate('/login');
      } else {
        setError(data.message || 'Unable to Logout');
      }

    } catch (error) {
       console.log(error)
      setError("Error Logging out")
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="w-full md:w-64 min-h-0 md:min-h-screen bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col flex-shrink-0 sticky top-0 z-10">
      {/* Logo */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold">PrimeHub</h1>
        <p className="text-xs text-gray-500">My Account</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 md:p-4 flex md:block gap-1 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 rounded-lg transition-all duration-200 text-sm whitespace-nowrap
                ${active 
                  ? 'bg-black text-white font-medium' 
                  : 'text-gray-600 hover:text-black hover:bg-gray-50'
                }
              `}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 md:p-4 border-t border-gray-200 flex md:block gap-1">
        <Link 
          to="/shop"
          className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 rounded-lg md:w-full whitespace-nowrap text-gray-500 hover:text-black hover:bg-gray-50 transition-all duration-200 text-sm"
        >
          <FaHome size={18} />
          <span>Back to Shop</span>
        </Link>
        <form onSubmit={handleLogout}>
          <button type="submit" className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 rounded-lg md:w-full whitespace-nowrap text-red-500 hover:bg-red-50 transition-all duration-200 text-sm mt-1"  disabled={loading}>
            <FaSignOutAlt size={18} />
            <span>Logout</span>
          </button>
          {error && <p className='text-xs text-red-500 text-center mt-2'>{error}</p>}
        </form>
      </div>
    </aside>
  )
}