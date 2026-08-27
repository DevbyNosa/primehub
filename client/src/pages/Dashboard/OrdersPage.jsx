// client/src/pages/OrdersPage.jsx
import { useState } from 'react'
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
  const [reviewModal, setReviewModal] = useState({ isOpen: false, orderId: null, productName: '' })

  const orders = [
    {
      id: '#1234',
      date: 'Aug 25, 2026',
      status: 'Delivered',
      total: '₦45,000',
      items: [{ name: 'Premium Leather Backpack', quantity: 1, price: '₦45,000' }],
      tracking: 'TRK-123456789'
    },
    {
      id: '#1233',
      date: 'Aug 20, 2026',
      status: 'Shipped',
      total: '₦25,000',
      items: [
        { name: 'Organic Cotton T-Shirt', quantity: 1, price: '₦15,000' },
        { name: 'Leather Wallet', quantity: 1, price: '₦10,000' }
      ],
      tracking: 'TRK-987654321'
    },
    {
      id: '#1232',
      date: 'Aug 15, 2026',
      status: 'Processing',
      total: '₦85,000',
      items: [{ name: 'Wireless Headphones', quantity: 1, price: '₦85,000' }],
      tracking: null
    },
    {
      id: '#1231',
      date: 'Aug 10, 2026',
      status: 'Cancelled',
      total: '₦15,000',
      items: [{ name: 'Slim Laptop Sleeve', quantity: 1, price: '₦15,000' }],
      tracking: null
    }
  ]

  const getStatusIcon = (status) => {
    const icons = {
      'Delivered': <FaCheckCircle className="text-green-500" size={18} />,
      'Shipped': <FaTruck className="text-blue-500" size={18} />,
      'Processing': <FaBoxOpen className="text-yellow-500" size={18} />,
      'Cancelled': <FaTimesCircle className="text-red-500" size={18} />
    }
    return icons[status] || <FaBoxOpen className="text-gray-400" size={18} />
  }

  const getStatusColor = (status) => {
    const colors = {
      'Delivered': 'text-green-600 bg-green-50',
      'Shipped': 'text-blue-600 bg-blue-50',
      'Processing': 'text-yellow-600 bg-yellow-50',
      'Cancelled': 'text-red-600 bg-red-50'
    }
    return colors[status] || 'text-gray-600 bg-gray-50'
  }

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <SideBar />

      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
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
          <p className="text-2xl font-bold text-gray-900">4</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Total Orders</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 hover:shadow-md transition">
          <p className="text-2xl font-bold text-blue-700">₦170k</p>
          <p className="text-xs text-blue-600 uppercase tracking-wider mt-1">Total Spent</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 hover:shadow-md transition">
          <p className="text-2xl font-bold text-green-700">1</p>
          <p className="text-xs text-green-600 uppercase tracking-wider mt-1">Delivered</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 hover:shadow-md transition">
          <p className="text-2xl font-bold text-yellow-700">1</p>
          <p className="text-xs text-yellow-600 uppercase tracking-wider mt-1">Processing</p>
        </div>
      </div>

        {/* Orders List */}
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
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-xs text-gray-400">{order.date}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                  <p className="font-medium text-gray-900">{order.total}</p>
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
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                        <span className="text-gray-800">{item.price}</span>
                      </div>
                    ))}
                  </div>

                  {order.tracking && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Tracking</p>
                      <p className="text-sm font-mono text-gray-600 mt-1">{order.tracking}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Link 
                      to={`/orders/${order.id}`}
                      className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition"
                    >
                      <FaEye size={14} /> View Details
                    </Link>
                    {order.status === 'Delivered' && (
                      <button 
                        onClick={() => setReviewModal({ 
                          isOpen: true, 
                          orderId: order.id, 
                          productName: order.items[0]?.name || 'Product' 
                        })}
                        className="text-sm text-gray-500 hover:text-black transition"
                      >
                        Write a Review
                      </button>
                    )}
                    {order.status === 'Processing' && (
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
        onClose={() => setReviewModal({ isOpen: false, orderId: null, productName: '' })}
        orderId={reviewModal.orderId}
        productName={reviewModal.productName}
      />
    </div>
  )
}