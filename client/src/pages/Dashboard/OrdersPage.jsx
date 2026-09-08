// client/src/pages/OrdersPage.jsx
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaBoxOpen, 
  FaTruck, 
  FaCheckCircle, 
  FaTimesCircle,
  FaArrowRight,
  FaEye
} from 'react-icons/fa'
import SideBar from '../../components/Dashboard/SideBar'
import ReviewModal from '../../components/Dashboard/ReviewModal'

export default function OrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [reviewModal, setReviewModal] = useState({ isOpen: false, orderId: null, productId: null, productName: '' })
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/customer/orders', { credentials: 'include' })
        const data = await response.json()
        if (!response.ok || !data.success) throw new Error(data.message || 'Unable to fetch orders')
        setOrders(data.orders)
      } catch (fetchError) {
        setError(fetchError.message)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const stats = useMemo(() => ({
    total: orders.length,
    spent: orders
      .filter((order) => order.payment_status === 'paid')
      .reduce((sum, order) => sum + Number(order.total_amount || 0), 0),
    delivered: orders.filter((order) => order.status === 'delivered').length,
    processing: orders.filter((order) => order.status === 'processing').length
  }), [orders])

  const getStatusIcon = (status) => {
    const icons = {
      delivered: <FaCheckCircle className="text-green-500" size={18} />,
      shipped: <FaTruck className="text-blue-500" size={18} />,
      processing: <FaBoxOpen className="text-yellow-500" size={18} />,
      cancelled: <FaTimesCircle className="text-red-500" size={18} />
    }
    return icons[status] || <FaBoxOpen className="text-gray-400" size={18} />
  }

  const getStatusColor = (status) => {
    const colors = {
      delivered: 'text-green-600 bg-green-50',
      shipped: 'text-blue-600 bg-blue-50',
      processing: 'text-yellow-600 bg-yellow-50',
      cancelled: 'text-red-600 bg-red-50'
    }
    return colors[status] || 'text-gray-600 bg-gray-50'
  }

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const markItemReviewed = (productId) => {
    setOrders((current) => current.map((order) => ({
      ...order,
      items: order.items.map((item) => (
        item.product_id === productId ? { ...item, review_id: true } : item
      ))
    })))
  }

  if (loading) {
    return <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-white"><SideBar /><main className="flex-1 min-w-0 p-4 sm:p-8"><div className="animate-pulse space-y-5"><div className="h-8 bg-gray-200 rounded w-1/3" /><div className="h-24 bg-gray-200 rounded" /><div className="h-24 bg-gray-200 rounded" /></div></main></div>
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-white">
      <SideBar />

      <div className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light tracking-tight">Orders</h1>
            <p className="text-gray-400 text-sm mt-1">Track and manage your purchases</p>
          </div>
          <Link 
            to="/shop"
           className="mt-3 sm:mt-0 bg-black text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-800 transition inline-flex items-center gap-2"
          >
            Continue Shopping <FaArrowRight size={14} />
          </Link>
        </div>

        {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Total Orders</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 hover:shadow-md transition">
          <p className="text-2xl font-bold text-blue-700">₦{stats.spent.toLocaleString()}</p>
          <p className="text-xs text-blue-600 uppercase tracking-wider mt-1">Total Spent</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 hover:shadow-md transition">
          <p className="text-2xl font-bold text-green-700">{stats.delivered}</p>
          <p className="text-xs text-green-600 uppercase tracking-wider mt-1">Delivered</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 hover:shadow-md transition">
          <p className="text-2xl font-bold text-yellow-700">{stats.processing}</p>
          <p className="text-xs text-yellow-600 uppercase tracking-wider mt-1">Processing</p>
        </div>
      </div>

        {/* Orders List */}
        {error && <div className="mb-6 bg-red-50 border border-red-100 text-red-700 rounded-xl p-4">{error}</div>}
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border-b border-gray-100 pb-6 last:border-0">
              {/* Order Header */}
              <div 
                className="flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer group"
                onClick={() => toggleExpand(order.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block">
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.order_number}</p>
                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                  <p className="font-medium text-gray-900">₦{Number(order.total_amount).toLocaleString()}</p>
                  <span className="text-gray-300 text-xl font-light">
                    {expandedOrder === order.id ? '−' : '+'}
                  </span>
                </div>
              </div>

              {/* Expanded */}
              {expandedOrder === order.id && (
                <div className="mt-4 pl-4 sm:pl-12 space-y-4">
                  <div className="space-y-1.5">
                    {order.items.map((item, idx) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.product_name} <span className="text-gray-400">×{item.quantity}</span></span>
                        <span className="text-gray-800">₦{Number(item.total).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {order.tracking_number && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Tracking</p>
                      <p className="text-sm font-mono text-gray-600 mt-1">{order.tracking_number}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <span className="inline-flex items-center gap-2 text-sm text-gray-500"><FaEye size={14} /> Order details</span>
                    {['shipped', 'delivered'].includes(order.status) && order.items.filter((item) => !item.review_id).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setReviewModal({ isOpen: true, orderId: order.id, productId: item.product_id, productName: item.product_name })}
                        className="text-sm text-gray-500 hover:text-black transition"
                      >
                        Review {item.product_name}
                      </button>
                    ))}
                    {order.status === 'processing' && (
                      <button className="text-sm text-red-400 hover:text-red-600 transition">
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-light text-gray-900">No orders yet</h3>
            <p className="text-gray-400 text-sm mt-2">Start shopping to see your orders here</p>
            <Link 
              to="/shop"
              className="inline-block mt-6 text-sm text-gray-500 hover:text-black transition border-b border-gray-300 pb-0.5"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal 
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ isOpen: false, orderId: null, productId: null, productName: '' })}
        orderId={reviewModal.orderId}
        productId={reviewModal.productId}
        productName={reviewModal.productName}
        onSubmitted={markItemReviewed}
      />
    </div>
  )
}