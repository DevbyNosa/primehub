
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaStar, FaShoppingCart, FaArrowLeft, FaHeart, FaRegHeart } from 'react-icons/fa'
import HeaderComponent from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../components/context/CartContext'
import { useWishlist } from '../components/context/WishlistContext'



export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [relatedProducts, setRelatedProducts] = useState([])
  const {slug} = useParams()

  const inWishlist = isInWishlist(product?.id)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/product/${slug}`)
        const data = await res.json()
        if (data.success) {
          setProduct(data.product)
          
          if (data.product.category_id) {
            const relatedRes = await fetch(`/api/products?category=${data.product.category_id}&limit=4`)
            const relatedData = await relatedRes.json()
            if (relatedData.success) {
              setRelatedProducts(relatedData.products.filter(p => p.id !== data.product.id))
            }
          }
        } else {
          navigate('/404')
        }
      } catch (error) {
        console.error('Fetch product error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, navigate])

  const handleAddToCart = () => {
    addToCart({ ...product, quantity })
  }

  const handleWishlist = async () => {
    if (inWishlist) {
      await removeFromWishlist(product.id)
    } else {
      await addToWishlist(product.id)
    }
  }

  if (loading) {
    return (
      <>
        <HeaderComponent />
        <div className="max-w-7xl mx-auto px-4 py-32">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-xl mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!product) {
    return (
      <>
        <HeaderComponent />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link to="/shop" className="mt-4 inline-block text-black border border-black px-6 py-2 rounded hover:bg-black hover:text-white transition">
            Back to Shop
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  const images = product.images?.length > 0 ? product.images : ['/placeholder.jpg']

  return (
    <>
      <HeaderComponent />
      <main className="max-w-7xl mx-auto px-4 py-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-black">Shop</Link>
          <span>/</span>
          <span className="text-black font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="bg-gray-50 rounded-xl overflow-hidden">
              <img 
                src={images[activeImage]} 
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto">
                {images.map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                      activeImage === index ? 'border-black' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Category */}
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
              {product.category_name || 'Uncategorized'}
            </p>

            {/* Name */}
            <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < Math.floor(product.ratings || 4) ? 'text-black' : 'text-gray-300'} 
                    size={18}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.num_reviews || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold">₦{Number(product.price).toLocaleString()}</span>
              {product.compare_price && (
                <span className="text-lg text-gray-400 line-through">₦{Number(product.compare_price).toLocaleString()}</span>
              )}
            </div>

            {/* Stock */}
            <div className="mb-4">
              {product.stock_quantity > 0 ? (
                <span className="text-sm text-green-600">✅ In Stock ({product.stock_quantity} available)</span>
              ) : (
                <span className="text-sm text-red-500">❌ Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <label className="text-sm font-medium">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition"
                >
                  -
                </button>
                <span className="px-4 py-2 min-w-[40px] text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock_quantity || 10, quantity + 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button 
                onClick={handleAddToCart}
                disabled={product.stock_quantity <= 0}
                className="flex-1 bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FaShoppingCart size={18} /> Add to Cart
              </button>
              
              <button 
                onClick={handleWishlist}
                className="px-6 py-3 border border-black rounded-lg hover:bg-black hover:text-white transition flex items-center justify-center"
              >
                {inWishlist ? <FaHeart size={18} className="text-red-500" /> : <FaRegHeart size={18} />}
              </button>
            </div>

            {/* Product Meta */}
            <div className="border-t border-gray-200 pt-4 text-sm text-gray-500 space-y-1">
              <p>SKU: #{product.id}</p>
              <p>Category: {product.category_name || 'Uncategorized'}</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map(p => (
                <Link to={`/product/${p.id}`} key={p.id} className="group">
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 group-hover:shadow-lg transition">
                    <img 
                      src={p.images?.[0] || '/placeholder.jpg'} 
                      alt={p.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="p-4">
                      <h3 className="font-medium text-sm line-clamp-1">{p.name}</h3>
                      <p className="font-bold text-lg">₦{Number(p.price).toLocaleString()}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}