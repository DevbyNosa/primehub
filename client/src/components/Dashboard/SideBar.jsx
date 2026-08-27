// client/src/components/dashboard/SideBar.jsx
import { Link, useLocation } from "react-router-dom"
import { FaUser, FaShoppingBag, FaHeart, FaCog, FaSignOutAlt, FaHome } from 'react-icons/fa'

export default function SideBar() {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', icon: FaUser, label: 'Dashboard' },
    { path: '/dashboard/orders', icon: FaShoppingBag, label: 'Orders' },
    { path: '/dashboard/wishlist', icon: FaHeart, label: 'Wishlist' },
    { path: '/dashboard/settings', icon: FaCog, label: 'Settings' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col flex-shrink-0 sticky top-0 hidden md:flex">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold">PrimeHub</h1>
        <p className="text-xs text-gray-500">My Account</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm
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
      <div className="p-4 border-t border-gray-200">
        <Link 
          to="/shop"
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-gray-500 hover:text-black hover:bg-gray-50 transition-all duration-200 text-sm"
        >
          <FaHome size={18} />
          <span>Back to Shop</span>
        </Link>
        <button className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-red-500 hover:bg-red-50 transition-all duration-200 text-sm mt-1">
          <FaSignOutAlt size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}