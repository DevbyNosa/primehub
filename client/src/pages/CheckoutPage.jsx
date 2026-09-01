import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaLock, FaTruck, FaCreditCard } from 'react-icons/fa'
import HeaderComponent from '../components/Header'
import Footer from '../components/Footer'

export default function CheckoutPage() {
const navigate = useNavigate()
const [cart, setCart] = useState([])
const [loading, setLoading] = useState(false)
const [step, setStep] = useState(1)
const [formData, setFormData] = useState({
fullName: '',
email: '',
phone: '',
address: '',
city: '',
state: '',
zipCode: '',
country: 'Nigeria'
})
const [paymentMethod, setPaymentMethod] = useState('card')

useEffect(() => {
const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
if (savedCart.length === 0) {
  navigate('/shop')
}
setCart(savedCart)
}, [navigate])

const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
const shipping = subtotal > 50000 ? 0 : 2500
const tax = subtotal * 0.075
const total = subtotal + shipping + tax

const handleChange = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value })
}

const handlePlaceOrder = async (e) => {
e.preventDefault()
setLoading(true)

try {
  const orderRes = await fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: cart,
      subtotal,
      shipping,
      tax,
      total,
      address: formData,
      paymentMethod: 'flutterwave'
    }),
    credentials: 'include'
  })

  const orderData = await orderRes.json()

  if (!orderData.success) {
    throw new Error(orderData.message || 'Order failed')
  }

  const order = orderData.order

  const paymentRes = await fetch('http://localhost:3000/api/payment/initialize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId: order.order_number,
      amount: total,
      email: formData.email,
      name: formData.fullName,
      phone_number: formData.phone
    }),
    credentials: 'include'
  })

  const paymentData = await paymentRes.json()

  if (paymentData.success) {
    window.location.href = paymentData.data.link
  } else {
    alert(paymentData.message || 'Payment initialization failed. Please try again.')
  }
} catch (error) {
  console.error('Order error:', error)
  alert(error.message || 'Something went wrong. Please try again.')
} finally {
  setLoading(false)
}
}

const states = ['Lagos', 'Abuja', 'Rivers', 'Oyo', 'Kano', 'Kaduna', 'Enugu', 'Delta', 'Edo', 'Borno', 'Anambra', 'Osun', 'Ondo', 'Ekiti', 'Bayelsa', 'Imo', 'Kogi', 'Niger', 'Benue', 'Cross River']

return (
<>
  <HeaderComponent />
  <div className="min-h-screen mt-15 bg-gray-50 py-12 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/cart" className="text-gray-500 hover:text-black transition">
          <FaArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-light tracking-tight">Checkout</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {/* Steps */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </span>
              <span className="text-sm font-medium">Shipping</span>
            </div>
            <div className="w-12 h-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </span>
              <span className="text-sm font-medium">Payment</span>
            </div>
            <div className="w-12 h-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 3 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
                3
              </span>
              <span className="text-sm font-medium">Confirm</span>
            </div>
          </div>

          <form onSubmit={handlePlaceOrder} className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
                    >
                      <option value="Nigeria">Nigeria</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street address"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
                      required
                    >
                      <option value="">Select state</option>
                      {states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition"
                      required
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Payment Method</h2>
                <div className="space-y-3">
                  <div className={`border rounded-lg p-4 cursor-pointer transition ${paymentMethod === 'card' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => setPaymentMethod('card')}>
                    <div className="flex items-center gap-3">
                      <input type="radio" checked={paymentMethod === 'card'} readOnly className="accent-black" />
                      <FaCreditCard />
                      <span className="font-medium">Card Payment</span>
                      <span className="text-xs text-gray-500 ml-auto">Flutterwave</span>
                    </div>
                  </div>
                  <div className={`border rounded-lg p-4 cursor-pointer transition ${paymentMethod === 'transfer' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => setPaymentMethod('transfer')}>
                    <div className="flex items-center gap-3">
                      <input type="radio" checked={paymentMethod === 'transfer'} readOnly className="accent-black" />
                      <FaTruck />
                      <span className="font-medium">Bank Transfer</span>
                      <span className="text-xs text-gray-500 ml-auto">Manual</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition font-medium">
                    Back
                  </button>
                  <button type="button" onClick={() => setStep(3)} className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium">
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Confirm Order</h2>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping Address</span>
                    <span className="text-right">
                      {formData.fullName}<br />
                      {formData.address}<br />
                      {formData.city}, {formData.state} {formData.zipCode}<br />
                      {formData.country}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment</span>
                    <span className="capitalize">{paymentMethod}</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition font-medium">
                    Back
                  </button>
                  <button type="submit" disabled={loading} className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-50">
                    {loading ? 'Placing Order...' : `Place Order • ₦${total.toLocaleString()}`}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-4">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
            
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4 pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded border border-gray-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">×{item.quantity}</span>
                      <span className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₦${shipping.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax (7.5%)</span>
                <span>₦{tax.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <FaLock size={12} /> Secure checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</>
)
}