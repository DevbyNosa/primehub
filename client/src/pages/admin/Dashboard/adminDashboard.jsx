import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaUsers, 
  FaBox, 
  FaShoppingBag, 
  FaMoneyBillWave,
  FaEye,
  FaArrowRight,
  FaBell
} from 'react-icons/fa'
import AdminSidebar from '../../../components/Dashboard/admin/AdminSidebar'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Title
} from 'chart.js'
import { Doughnut, Line } from 'react-chartjs-2'

const READ_NOTIFICATIONS_KEY = 'primehub-admin-read-notifications'

//  Register ALL required components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Title
)

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [readNotificationIds, setReadNotificationIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(READ_NOTIFICATIONS_KEY) || '[]'))
    } catch {
      return new Set()
    }
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats', { credentials: 'include' })
        const data = await res.json()
        if (data.success) {
          setStats(data.stats)
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/admin/notifications', { credentials: 'include' })
        const data = await res.json()
        if (data.success) {
          setNotifications(data.notifications.slice(0, 5))
        }
      } catch (error) {
        console.error('Error fetching admin notifications:', error)
      }
    }

    fetchNotifications()
  }, [])

  useEffect(() => {
    if (!showNotifications) return

    const handleOutsideClick = (event) => {
      if (!event.target.closest('[data-notification-menu]')) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [showNotifications])

  const unreadNotificationCount = notifications.filter(
    (notification) => !readNotificationIds.has(notification.id)
  ).length

  const markNotificationAsRead = (id) => {
    setReadNotificationIds((current) => {
      const next = new Set(current).add(id)
      localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify([...next]))
      return next
    })
  }

  const markAllNotificationsAsRead = () => {
    setReadNotificationIds((current) => {
      const next = new Set([...current, ...notifications.map((notification) => notification.id)])
      localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify([...next]))
      return next
    })
  }

  const formatNotificationDate = (date) => new Date(date).toLocaleDateString([], {
    month: 'short',
    day: 'numeric'
  })

  // Order Status Data
  const orderStatusData = {
    labels: stats?.ordersByStatus?.map(item => 
      item.status?.charAt(0).toUpperCase() + item.status?.slice(1)
    ) || ['No Data'],
    datasets: [
      {
        data: stats?.ordersByStatus?.map(item => item.count) || [1],
        backgroundColor: ['#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#EF4444', '#6B7280'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  }

  // Weekly Sales Data (REAL data from database)
  const weeklySalesData = {
    labels: stats?.weeklySales?.map(item => {
      const date = new Date(item.date)
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    }) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sales (₦)',
        data: stats?.weeklySales?.map(item => Number(item.total) || 0) || [0, 0, 0, 0, 0, 0, 0],
        borderColor: '#000000',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#000000',
        pointBorderColor: '#000000',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }

  // Line Chart Options
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': ₦'
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString()
            }
            return label
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value) {
            return '₦' + value.toLocaleString()
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  //  Doughnut Chart Options
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || ''
            let value = context.parsed || 0
            let total = context.dataset.data.reduce((a, b) => a + b, 0)
            let percentage = total > 0 ? Math.round((value / total) * 100) : 0
            return label + ': ' + value + ' (' + percentage + '%)'
          }
        }
      }
    },
    cutout: '65%',
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  }

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-64 bg-gray-200 rounded-xl"></div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Overview of your store</p>
          </div>
          <div className="mt-3 sm:mt-0 flex items-center gap-3">
            <div className="relative" data-notification-menu>
              <button
                type="button"
                aria-label="Open notifications"
                aria-expanded={showNotifications}
                onClick={() => setShowNotifications((current) => !current)}
                className="relative w-10 h-10 rounded-lg border border-gray-200 bg-white text-gray-600 hover:text-black hover:border-black transition flex items-center justify-center"
              >
                <FaBell size={17} />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="fixed inset-x-4 top-24 z-20 w-auto max-w-none bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2 sm:w-80 sm:max-w-[calc(100vw-3rem)]">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <div>
                      <p className="font-semibold text-gray-900">Notifications</p>
                      <p className="text-xs text-gray-500">{unreadNotificationCount} unread</p>
                    </div>
                    <Link
                      to="/admin/notifications"
                      onClick={() => {
                        markAllNotificationsAsRead()
                        setShowNotifications(false)
                      }}
                      className="text-xs font-medium text-gray-500 hover:text-black"
                    >
                      View all
                    </Link>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-gray-500">No new activity</p>
                  ) : (
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.slice(0, 3).map((notification) => {
                        const isUnread = !readNotificationIds.has(notification.id)
                        return (
                          <Link
                            key={notification.id}
                            to={notification.href}
                            onClick={() => {
                              markNotificationAsRead(notification.id)
                              setShowNotifications(false)
                            }}
                            className={`block px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition ${isUnread ? 'bg-blue-50/40' : ''}`}
                          >
                            <div className="flex items-start gap-2">
                              {isUnread && <span className="mt-1.5 w-2 h-2 shrink-0 rounded-full bg-blue-600" />}
                              <span className={isUnread ? '' : 'ml-4'}>
                                <span className="block text-sm font-medium text-gray-900 line-clamp-1">{notification.title}</span>
                                <span className="block text-xs text-gray-600 mt-1 line-clamp-2">{notification.message}</span>
                                <span className="block text-[11px] text-gray-400 mt-1">{formatNotificationDate(notification.createdAt)}</span>
                              </span>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
            <Link 
              to="/admin/products/new"
              className="bg-black text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-800 transition inline-flex items-center gap-2"
            >
              <FaBox size={14} /> Add Product
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ₦{stats?.totalRevenue?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-green-600 mt-1">+12% this month</p>
              </div>
              <div className="bg-green-50 p-3 rounded-full">
                <FaMoneyBillWave className="text-green-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats?.totalOrders || 0}
                </p>
                <p className="text-xs text-blue-600 mt-1">Last 30 days</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <FaShoppingBag className="text-blue-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats?.totalProducts || 0}
                </p>
                <p className="text-xs text-purple-600 mt-1">Active listings</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-full">
                <FaBox className="text-purple-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats?.totalUsers || 0}
                </p>
                <p className="text-xs text-orange-600 mt-1">Registered customers</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-full">
                <FaUsers className="text-orange-600" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Line Chart - Weekly Sales */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Weekly Sales</h2>
            <div className="h-64">
              {stats?.weeklySales?.length > 0 ? (
                <Line data={weeklySalesData} options={lineOptions} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <p className="text-lg">No sales data available</p>
                    <p className="text-xs mt-1">Sales data will appear here once orders are placed</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Doughnut Chart - Order Status */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4">Order Status</h2>
            <div className="h-64 flex items-center justify-center">
              {stats?.ordersByStatus?.length > 0 ? (
                <Doughnut data={orderStatusData} options={doughnutOptions} />
              ) : (
                <p className="text-gray-400 text-sm">No orders yet</p>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {stats?.ordersByStatus?.map((item) => (
                <div key={item.status} className="flex items-center gap-1 text-xs">
                  <span className={`w-3 h-3 rounded-full ${
                    item.status === 'pending' ? 'bg-yellow-400' :
                    item.status === 'processing' ? 'bg-blue-400' :
                    item.status === 'shipped' ? 'bg-purple-400' :
                    item.status === 'delivered' ? 'bg-green-400' :
                    item.status === 'cancelled' ? 'bg-red-400' :
                    'bg-gray-400'
                  }`}></span>
                  <span className="capitalize">{item.status}: {item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <Link 
              to="/admin/orders" 
              className="text-sm text-gray-500 hover:text-black transition flex items-center gap-1"
            >
              View All <FaArrowRight size={12} />
            </Link>
          </div>

          {stats?.recentOrders?.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Order</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Total</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders?.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{order.order_number}</td>
                      <td className="py-3 px-4">{order.customer_name}</td>
                      <td className="py-3 px-4">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-medium">₦{Number(order.total_amount).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                          {order.status || 'pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Link 
                          to={`/admin/orders/${order.id}`}
                          className="text-gray-500 hover:text-black transition"
                        >
                          <FaEye size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Link 
            to="/admin/products"
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition flex items-center gap-3"
          >
            <FaBox className="text-gray-700" size={20} />
            <span className="text-sm font-medium">Manage Products</span>
          </Link>
          <Link 
            to="/admin/orders"
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition flex items-center gap-3"
          >
            <FaShoppingBag className="text-gray-700" size={20} />
            <span className="text-sm font-medium">Manage Orders</span>
          </Link>
          <Link 
            to="/admin/users"
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition flex items-center gap-3"
          >
            <FaUsers className="text-gray-700" size={20} />
            <span className="text-sm font-medium">Manage Users</span>
          </Link>
          <Link 
            to="/admin/settings"
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition flex items-center gap-3"
          >
            <FaMoneyBillWave className="text-gray-700" size={20} />
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  )
}