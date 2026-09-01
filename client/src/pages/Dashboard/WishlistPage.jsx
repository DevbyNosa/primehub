// client/src/pages/WishlistPage.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaHeart, FaShoppingCart, FaTrash, FaArrowRight } from 'react-icons/fa'
import SideBar from '../../components/Dashboard/SideBar'

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlist() {
      try {
        // ✅ Add 'fetch' and correct endpoint
        const res = await fetch('/api/wishlist', {
          credentials: 'include'
        });
        const data = await res.json();
        console.log(data);
        
        if (data.success) {
          setWishlist(data.wishlist);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWishlist();
  }, []);

  const removeFromWishlist = (id) => {
    // TODO: Delete from backend
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  const moveToCart = (id) => {
    console.log('Added to cart:', id);
    removeFromWishlist(id);
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <SideBar />
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="text-center py-20">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SideBar />

      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light tracking-tight">Wishlist</h1>
            <p className="text-gray-400 text-sm mt-1">{wishlist.length} items saved</p>
          </div>
          <Link 
            to="/shop"
            className="mt-3 sm:mt-0 bg-black text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-800 transition inline-flex items-center gap-2"
          >
            Continue Shopping <FaArrowRight size={12} />
          </Link>
        </div>

        {/* Wishlist Grid */}
        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">❤️</div>
            <h3 className="text-xl font-light text-gray-900">Your wishlist is empty</h3>
            <p className="text-gray-400 text-sm mt-2">Start saving your favorite items</p>
            <Link 
              to="/shop"
              className="inline-block mt-6 text-sm text-gray-500 hover:text-black transition border-b border-gray-300 pb-0.5"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden group hover:shadow-md transition">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <Link to={`/product/${item.slug}`}>
                    <img 
                      src={item.images?.[0] || '/placeholder.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </Link>
                  <button 
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:bg-red-50 transition shadow-sm"
                  >
                    <FaTrash className="text-red-500" size={14} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  <Link to={`/product/${item.slug}`}>
                    <h3 className="font-medium text-gray-900 hover:text-gray-600 transition">{item.name}</h3>
                  </Link>
                  
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm text-yellow-500">★</span>
                    <span className="text-sm text-gray-600">{item.rating}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-gray-900">₦{Number(item.price).toLocaleString()}</span>
                    <button 
                      onClick={() => moveToCart(item.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-black text-white hover:bg-gray-800 transition"
                    >
                      <FaShoppingCart size={14} /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}