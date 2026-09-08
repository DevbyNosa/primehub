
import { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
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
  FaArrowRight,
  FaClock
} from 'react-icons/fa'
import SideBar from "../../components/Dashboard/SideBar"

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('1️⃣ Fetching user data...')
        // Get user info
        const userRes = await fetch('/api/auth/me', { credentials: 'include' })
       
        const userData = await userRes.json()
        
        if (userData.success) {
          setUser(userData.user)
        }

        console.log('4️⃣ Fetching dashboard stats...')
        // Get dashboard stats
        const statsRes = await fetch('/api/customer/dashboard/stats', { credentials: 'include' })
       
        const statsData = await statsRes.json()
       
        if (statsData.success) {
          setStats(statsData.stats)
        }
      } catch (error) {
        console.error('❌ Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // ... rest of your component


  if (loading) {
    return (
      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50">
        <SideBar />
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50">
      <SideBar />

      <div className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name || 'Customer'}! 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Here's what's happening with your orders
            </p>
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
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats?.totalOrders || 0}
                </p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <FaArrowUp size={10} /> +{stats?.ordersThisMonth || 0} this month
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
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ₦{stats?.totalSpent?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-gray-400 mt-1">All time</p>
              </div>
              <div className="bg-black/5 p-3 rounded-full">
                <FaWallet className="text-gray-700" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats?.pendingOrders || 0}
                </p>
                <p className="text-xs text-yellow-600 flex items-center gap-1 mt-1">
                  <FaClock size={10} /> Awaiting payment
                </p>
              </div>
              <div className="bg-black/5 p-3 rounded-full">
                <FaClock className="text-gray-700" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Wishlist</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats?.wishlistCount || 0}
                </p>
                <p className="text-xs text-gray-400 mt-1">Saved items</p>
              </div>
              <div className="bg-black/5 p-3 rounded-full">
                <FaHeart className="text-gray-700" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <Link 
              to="/dashboard/orders" 
              className="text-sm text-gray-500 hover:text-black transition flex items-center gap-1"
            >
              View All <FaArrowRight size={12} />
            </Link>
          </div>

          {stats?.recentOrders?.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {stats?.recentOrders?.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{order.order_number}</p>
                    <p className="text-xs text-gray-500">
                      ₦{order.total_amount?.toLocaleString()} • {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'shipped' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status || 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Link 
            to="/shop"
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition flex items-center gap-3"
          >
            <FaShoppingCart className="text-gray-700" size={20} />
            <span className="text-sm font-medium">Continue Shopping</span>
          </Link>
          <Link 
            to="/dashboard/wishlist"
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition flex items-center gap-3"
          >
            <FaRegHeart className="text-gray-700" size={20} />
            <span className="text-sm font-medium">View Wishlist</span>
          </Link>
          <Link 
            to="/dashboard/orders"
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition flex items-center gap-3"
          >
            <FaTruck className="text-gray-700" size={20} />
            <span className="text-sm font-medium">Track Orders</span>
          </Link>
        </div>
      </div>
    </div>
  )
}