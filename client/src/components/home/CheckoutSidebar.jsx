// client/src/components/home/CheckoutSidebar.jsx
import { FaTimes, FaTrash } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const CheckoutSidebar = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart()

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        flex flex-col
      `}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Your Cart ({totalItems})</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Your cart is empty</p>
              <Link 
                to="/shop" 
                onClick={onClose}
                className="inline-block mt-4 text-black border border-black px-6 py-2 hover:bg-black hover:text-white transition"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-3 border-b border-gray-100 pb-3">
                {/* Image */}
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-16 h-16 object-cover"
                />
                
                {/* Details */}
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{item.name}</h4>
                  <p className="text-sm font-bold">₦{item.price.toLocaleString()}</p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="border border-gray-300 px-2 py-0.5 text-sm hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="text-sm w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="border border-gray-300 px-2 py-0.5 text-sm hover:bg-gray-100"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto text-red-500 hover:text-red-700 text-sm"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₦{totalPrice.toLocaleString()}</span>
            </div>
            <Link 
              to="/checkout" 
              onClick={onClose}
              className="block w-full text-center bg-black text-white py-3 hover:bg-gray-800 transition"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

export default CheckoutSidebar