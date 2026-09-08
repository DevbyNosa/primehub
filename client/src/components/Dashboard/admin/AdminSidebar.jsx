import { Link, useLocation, useNavigate } from 'react-router-dom'  
import { 
  FaHome, 
  FaBox, 
  FaShoppingBag, 
  FaUsers, 
  FaCog,
  FaSignOutAlt,
  FaChartBar,
  FaBell,
  FaBoxOpen
  ,FaEnvelope
} from 'react-icons/fa'
import { useState } from 'react';

export default function AdminSidebar() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();  

  const navItems = [
    { path: '/admin/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/admin/products', icon: FaBox, label: 'Products' },
    { path: '/admin/orders', icon: FaShoppingBag, label: 'Orders' },
    { path: '/admin/users', icon: FaUsers, label: 'Users' },
    { path: '/admin/reports', icon: FaChartBar, label: 'Reports' },
    { path: "/admin/notifications", icon: FaBell, label: "Notifications"},
    { path: "/admin/messages", icon: FaEnvelope, label: "Messages"},
    { path: "/admin/categories", icon: FaBoxOpen, label: "Categories"},
    { path: '/admin/settings', icon: FaCog, label: 'Settings' },
  ]

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  async function handleLogout(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/logout", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'  
      });

      const data = await res.json();

      if(data.success) {
        navigate('/admin/login');
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
    <aside className="w-full md:w-64 min-h-0 md:min-h-screen bg-black text-white flex flex-col border-b md:border-b-0 md:border-r border-white/10 sticky top-0 z-10">
      {/* Logo */}
      <div className="p-4 md:p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-tight">PrimeHub</h1>
        <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 md:p-4 flex flex-wrap md:block gap-1 overflow-visible md:overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 rounded-lg transition-all duration-200 whitespace-nowrap
                ${active 
                  ? 'bg-white text-black font-medium' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <Icon size={18} />
              <span className="text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <form className="p-2 md:p-4 border-t border-white/10" onSubmit={handleLogout}>
        <button 
          type='submit'
          disabled={loading}  
          className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 w-full rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer disabled:opacity-50 whitespace-nowrap"
        >
          <FaSignOutAlt size={18} />
          <span className="text-sm">{loading ? 'Logging out...' : 'Logout'}</span>
        </button>
        {error && <p className='text-xs text-red-500 text-center mt-2'>{error}</p>}
      </form>
    </aside>
  )
}