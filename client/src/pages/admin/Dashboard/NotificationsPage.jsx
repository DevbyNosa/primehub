import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaBell,
  FaBox,
  FaEnvelope,
  FaShoppingBag,
  FaUser,
  FaCheck,
  FaExclamationTriangle
} from 'react-icons/fa'
import AdminSidebar from '../../../components/Dashboard/admin/AdminSidebar'

const READ_NOTIFICATIONS_KEY = 'primehub-admin-read-notifications'

const filters = [
  { value: 'all', label: 'All activity' },
  { value: 'order', label: 'Orders' },
  { value: 'user', label: 'Customers' },
  { value: 'stock', label: 'Stock' },
  { value: 'message', label: 'Messages' }
]

const iconByType = {
  order: FaShoppingBag,
  user: FaUser,
  stock: FaExclamationTriangle,
  message: FaEnvelope
}

const colorByType = {
  order: 'bg-blue-50 text-blue-600',
  user: 'bg-green-50 text-green-600',
  stock: 'bg-amber-50 text-amber-600',
  message: 'bg-purple-50 text-purple-600'
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all')
  const [readIds, setReadIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(READ_NOTIFICATIONS_KEY) || '[]'))
    } catch {
      return new Set()
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/admin/notifications', { credentials: 'include' })
        const data = await response.json()
        if (!response.ok || !data.success) throw new Error(data.message)
        setNotifications(data.notifications)
      } catch (fetchError) {
        setError(fetchError.message || 'Unable to load notifications')
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const filteredNotifications = useMemo(
    () => filter === 'all' ? notifications : notifications.filter((notification) => notification.type === filter),
    [filter, notifications]
  )

  const unreadCount = notifications.filter((notification) => !readIds.has(notification.id)).length

  const markAllAsRead = () => {
    const next = new Set(notifications.map((notification) => notification.id))
    localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify([...next]))
    setReadIds(next)
  }

  const markAsRead = (id) => {
    setReadIds((current) => {
      const next = new Set(current).add(id)
      localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify([...next]))
      return next
    })
  }

  const formatDate = (date) => new Date(date).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short'
  })

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-20 bg-gray-200 rounded" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FaBell className="text-gray-700" size={20} /> Notifications
            </h1>
            <p className="text-gray-500 text-sm mt-1">Stay on top of activity across your store.</p>
          </div>
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:border-black transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaCheck size={12} /> Mark all as read
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm transition ${filter === item.value ? 'bg-black text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-black'}`}
            >
              {item.label}
            </button>
          ))}
          <span className="ml-auto whitespace-nowrap self-center text-sm text-gray-500">{unreadCount} unread</span>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-5">{error}</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FaBell className="mx-auto text-gray-300" size={28} />
            <p className="font-medium text-gray-900 mt-3">You’re all caught up</p>
            <p className="text-sm text-gray-500 mt-1">New store activity will appear here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {filteredNotifications.map((notification) => {
              const Icon = iconByType[notification.type] || FaBox
              const isRead = readIds.has(notification.id)
              return (
                <Link
                  key={notification.id}
                  to={notification.href}
                  onClick={() => markAsRead(notification.id)}
                  className={`flex items-start gap-4 p-5 hover:bg-gray-50 transition ${isRead ? '' : 'bg-gray-50/70'}`}
                >
                  <span className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorByType[notification.type]}`}>
                    <Icon size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{notification.title}</span>
                      {!isRead && <span className="w-2 h-2 rounded-full bg-blue-600" aria-label="Unread" />}
                    </span>
                    <span className="block text-sm text-gray-600 mt-1">{notification.message}</span>
                    <span className="block text-xs text-gray-400 mt-2">{formatDate(notification.createdAt)}</span>
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}