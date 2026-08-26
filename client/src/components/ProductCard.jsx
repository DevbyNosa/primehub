// client/src/components/products/ProductCard.jsx
import { Link } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'
import { useCart } from './context/CartContext'  

export default function ProductCard({ product }) {
  const { addToCart } = useCart()  // ← Get addToCart

  return (
    <div className="group border border-gray-200 hover:border-black transition-all duration-300">
      <Link to={`/product/${product.id}`} className="block overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      <div className="p-4 space-y-2">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium hover:underline underline-offset-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={i < Math.floor(product.rating) ? 'text-black' : 'text-gray-300'}
              size={12}
            />
          ))}
          <span className="text-xs text-gray-500">({product.numReviews})</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
          <span className="text-base font-bold">₦{product.price.toLocaleString()}</span>
          <button
            onClick={() => addToCart(product)}  // ← Add to cart
            className="text-xs uppercase tracking-wider border border-black px-4 py-1.5 hover:bg-black hover:text-white transition-all duration-200 w-full sm:w-auto"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}