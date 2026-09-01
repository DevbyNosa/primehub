import { Link, useNavigate } from 'react-router-dom'
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa'
import { useCart } from './context/CartContext'
import { useWishlist } from './context/WishlistContext'
import ProtectedRoute from '../auth/protection/ProtectedRoute'
import { useAuth } from './context/AuthContext'

export default function ProductCard({ product }) {
   const navigate = useNavigate()
  const { addToCart } = useCart();
  const {user} = useAuth(); 
  const { 
  wishlist, 
  loading, 
  addToWishlist, 
  removeFromWishlist, 
  isInWishlist,
  wishlistCount 
} = useWishlist();

 
  const inWishlist = isInWishlist(product.id)

  const handleWishlist = async () => {
     if (!user) {
      navigate('/login')
      return
    }
    
  if (inWishlist) {
   
    const wishlistItem = wishlist.find(item => item.id === product.id)
    if (wishlistItem) {
      await removeFromWishlist(wishlistItem.wishlist_id)  
    }
  } else {
    await addToWishlist(product.id)
  }
}

  return (
    <div className="group border border-gray-200 hover:border-black transition-all duration-300 relative">
      {/* Wishlist Button */}
      <button 
        onClick={handleWishlist}
        className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-sm hover:scale-110 transition z-10"
      >
        {inWishlist ? (
          <FaHeart className="text-red-500" size={18} />
        ) : (
          <FaRegHeart className="text-gray-500" size={18} />
        )}
      </button>

      {/* Image */}
      <Link to={`/product/${product.slug}`} className="block overflow-hidden bg-gray-50">
        <img
          src={product.images?.[0] || '/placeholder.jpg'}
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Content */}
      <div className="p-4 space-y-2">
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium hover:underline underline-offset-2 line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={i < Math.floor(product.ratings || 0) ? 'text-black' : 'text-gray-300'}
              size={12}
            />
          ))}
          <span className="text-xs text-gray-500">({product.num_reviews || 0})</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
          <span className="text-base font-bold">₦{Number(product.price).toLocaleString()}</span>
          <button
            onClick={() => addToCart(product)}  
            className="text-xs uppercase tracking-wider border border-black px-4 py-1.5 hover:bg-black hover:text-white transition-all duration-200 w-full sm:w-auto"
          >
            Add 
          </button>
        </div>
      </div>
    </div>
  )
}