import { Link } from 'react-router-dom'
import { FaCheckCircle } from 'react-icons/fa'
import HeaderComponent from '../components/Header'
import Footer from '../components/Footer'

export default function OrderSuccessPage() {
  return (
    <>
      <HeaderComponent />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Placed! 🎉</h1>
          <p className="text-gray-500">Thank you for your purchase</p>
          <p className="text-sm text-gray-400 mt-2">Your order has been confirmed</p>
          <div className="mt-6 space-y-3">
            <Link to="/account/orders" className="block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
              View Orders
            </Link>
            <Link to="/shop" className="block border border-black text-black px-6 py-3 rounded-lg hover:bg-gray-100 transition">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}