// client/src/pages/Dashboard.jsx
import { Link } from "react-router-dom"
SideBar
import { 
  FaShoppingBag, 
  FaWallet, 
  FaHeart, 
  FaArrowUp, 
  FaArrowDown,
  FaShoppingCart,
  FaRegHeart,
  FaTruck,
  FaHeadset,
  FaArrowRight
} from 'react-icons/fa'
import SideBar from "../../components/Dashboard/SideBar"

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
     
      <SideBar />

      {/* Main Content - scrolls independently */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome back, John! 👋 Here's what's happening with your orders.</p>
          </div>
          <Link 
            to="/shop"
            className="mt-3 sm:mt-0 bg-black text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-800 transition inline-flex items-center gap-2"
          >
            Browse Shop <FaArrowRight size={14} />
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <FaArrowUp size={10} /> +3 this month
                </p>
              </div>
              <div className="bg-black/5 p-3 rounded-full">
                <FaShoppingBag className="text-gray-700" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">₦245,000</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <FaArrowUp size={10} /> +12% from last month
                </p>
              </div>
              <div className="bg-black/5 p-3 rounded-full">
                <FaWallet className="text-gray-700" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Wishlist</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">5</p>
                <p className="text-xs text-gray-400 mt-1">2 items on sale</p>
              </div>
              <div className="bg-black/5 p-3 rounded-full">
                <FaHeart className="text-gray-700" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Pending Delivery</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
                <p className="text-xs text-yellow-600 flex items-center gap-1 mt-1">
                  <FaArrowDown size={10} /> 1 due this week
                </p>
              </div>
              <div className="bg-black/5 p-3 rounded-full">
                <FaShoppingBag className="text-gray-700" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Recent Orders</h2>
              <Link 
                to="/dashboard/orders" 
                className="text-sm text-gray-500 hover:text-black transition flex items-center gap-1"
              >
                View All <FaArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm text-gray-900">#1234</p>
                  <p className="text-xs text-gray-500">₦45,000 • 2 items</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">Delivered</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm text-gray-900">#1233</p>
                  <p className="text-xs text-gray-500">₦25,000 • 1 item</p>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">Shipped</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm text-gray-900">#1232</p>
                  <p className="text-xs text-gray-500">₦85,000 • 3 items</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">Processing</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm text-gray-900">#1231</p>
                  <p className="text-xs text-gray-500">₦15,000 • 1 item</p>
                </div>
                <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">Cancelled</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link 
                  to="/shop"
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition flex items-center gap-3 block"
                >
                  <FaShoppingCart className="text-gray-600" size={18} />
                  Continue Shopping
                </Link>
                <Link 
                  to="/dashboard/wishlist"
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition flex items-center gap-3 block"
                >
                  <FaRegHeart className="text-gray-600" size={18} />
                  View Wishlist
                </Link>
                <Link 
                  to="/dashboard/orders"
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition flex items-center gap-3 block"
                >
                  <FaTruck className="text-gray-600" size={18} />
                  Track Orders
                </Link>
                <Link 
                  to="/shop"
                  className="w-full text-left px-4 py-3 bg-black text-white rounded-lg text-sm transition hover:bg-gray-800 flex items-center gap-3 block"
                >
                  <FaShoppingBag className="text-white" size={18} />
                  Shop Now
                </Link>
              </div>
            </div>

            <div className="bg-black text-white rounded-xl p-6">
              <FaHeadset className="text-3xl mb-3" />
              <h3 className="font-bold text-lg">Need Help?</h3>
              <p className="text-gray-400 text-sm mt-1">Our support team is here 24/7</p>
              <Link 
                to="/contact"
                className="mt-4 inline-block bg-white text-black px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}