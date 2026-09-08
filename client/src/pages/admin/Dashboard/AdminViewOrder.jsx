// client/src/pages/Admin/AdminOrderDetail.jsx
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  FaArrowLeft, 
  FaPrint, 
  FaDownload,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaTruck,
  FaBox,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCreditCard,
  FaShoppingBag
} from 'react-icons/fa'
import AdminSidebar from '../../../components/Dashboard/admin/AdminSidebar'

export default function AdminOrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchOrderDetail()
  }, [id])

  const fetchOrderDetail = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) {
        setOrder(data.order)
        setItems(data.items || [])
      }
    } catch (error) {
      console.error('Error fetching order detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (newStatus) => {
    if (!confirm(`Change order status to "${newStatus}"?`)) return

    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include'
      })
      const data = await res.json()
      if (data.success) {
        setOrder({ ...order, status: newStatus })
      }
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdating(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'processing': 'bg-blue-100 text-blue-700 border-blue-200',
      'shipped': 'bg-purple-100 text-purple-700 border-purple-200',
      'delivered': 'bg-green-100 text-green-700 border-green-200',
      'cancelled': 'bg-red-100 text-red-700 border-red-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const getStatusIcon = (status) => {
    const icons = {
      'pending': <FaClock className="text-yellow-500" size={20} />,
      'processing': <FaBox className="text-blue-500" size={20} />,
      'shipped': <FaTruck className="text-purple-500" size={20} />,
      'delivered': <FaCheckCircle className="text-green-500" size={20} />,
      'cancelled': <FaTimesCircle className="text-red-500" size={20} />
    }
    return icons[status] || <FaClock className="text-gray-500" size={20} />
  }

  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
            <Link to="/admin/orders" className="mt-4 inline-block text-black border border-black px-6 py-2 rounded hover:bg-black hover:text-white transition">
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/orders"
              className="text-gray-500 hover:text-black transition"
            >
              <FaArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order.order_number}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-3 sm:mt-0">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
            >
              <FaPrint size={16} /> Print
            </button>
          </div>
        </div>

        {/* Status Update */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(order.status)}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status?.toUpperCase() || 'PENDING'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Change status:</span>
              <select
                value={order.status}
                onChange={(e) => updateStatus(e.target.value)}
                disabled={updating}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition text-sm"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              {updating && <span className="text-sm text-gray-400">Updating...</span>}
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaUser size={18} /> Customer
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Name</p>
                <p className="font-medium">{order.customer_name || 'Guest'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Email</p>
                <p className="font-medium">{order.customer_email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Phone</p>
                <p className="font-medium">{order.customer_phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaMapMarkerAlt size={18} /> Shipping Address
            </h2>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{order.shipping_address}</p>
              <p>{order.shipping_city}, {order.shipping_state}</p>
              <p>{order.shipping_country} - {order.shipping_zip}</p>
              <p className="text-gray-500 text-xs">Phone: {order.phone || 'N/A'}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaCreditCard size={18} /> Payment
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Method</p>
                <p className="font-medium">{order.payment_method || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Status</p>
                <p className={`font-medium ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.payment_status?.toUpperCase() || 'PENDING'}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Total</p>
                <p className="font-bold text-lg">₦{Number(order.total_amount).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mt-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaShoppingBag size={18} /> Order Items ({items.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Quantity</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {item.product_image && (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <span className="font-medium">{item.product_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">₦{Number(item.price).toLocaleString()}</td>
                    <td className="py-3 px-4">{item.quantity}</td>
                    <td className="py-3 px-4 font-medium">₦{Number(item.total).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-200 font-bold">
                  <td colSpan="3" className="py-3 px-4 text-right">Total</td>
                  <td className="py-3 px-4">₦{Number(order.total_amount).toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mt-6">
          <h2 className="font-bold text-gray-900 mb-4">Order Timeline</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="min-w-[120px] text-sm text-gray-500">
                {new Date(order.created_at).toLocaleDateString()}
              </div>
              <div className="flex-1">
                <p className="font-medium">Order Placed</p>
                <p className="text-sm text-gray-500">
                  Order #{order.order_number} was created
                </p>
              </div>
            </div>
            {order.status !== 'pending' && (
              <div className="flex items-start gap-4">
                <div className="min-w-[120px] text-sm text-gray-500">
                  {new Date(order.updated_at).toLocaleDateString()}
                </div>
                <div className="flex-1">
                  <p className="font-medium">Status Updated</p>
                  <p className="text-sm text-gray-500">
                    Order status changed to "{order.status}"
                  </p>
                </div>
              </div>
            )}
            {order.status === 'delivered' && (
              <div className="flex items-start gap-4">
                <div className="min-w-[120px] text-sm text-gray-500">
                  {new Date(order.updated_at).toLocaleDateString()}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-green-600">Delivered</p>
                  <p className="text-sm text-gray-500">
                    Order was delivered successfully
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}