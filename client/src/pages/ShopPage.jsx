// client/src/pages/ShopPage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaFilter, FaTimes } from 'react-icons/fa'
import ProductCard from '../components/ProductCard'
import { Helmet } from 'react-helmet-async'
import HeaderComponent from '../components/Header'
import Footer from '../components/Footer'
import PromotionBanner from '../components/home/PromotionBanner'
import FadeIn from '../components/animations/FadeIn'
import SlideIn from '../components/animations/SlideIn'

export default function ShopPage() {
const [products, setProducts] = useState([])
const [filteredProducts, setFilteredProducts] = useState([])
const [loading, setLoading] = useState(true)
const [sort, setSort] = useState('newest')
const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

// Filter states
const [selectedCategory, setSelectedCategory] = useState('all')
const [priceRange, setPriceRange] = useState([0, 200000])
const [selectedRating, setSelectedRating] = useState(0)

const categories = ['all', 'electronics', 'fashion', 'home', 'beauty', 'sports', 'books']

useEffect(() => {
document.title="Shop - PrimeHub"
}, [])

useEffect(() => {

const fetchProducts = async () => {
  setLoading(true)
  
  const mockProducts = [
    { id: 1, name: 'Premium Leather Backpack', price: 45000, category: 'fashion', rating: 4.8, numReviews: 42, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop' },
    { id: 2, name: 'Wireless Headphones', price: 85000, category: 'electronics', rating: 4.9, numReviews: 38, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop' },
    { id: 3, name: 'Minimalist Smart Watch', price: 120000, category: 'electronics', rating: 4.7, numReviews: 29, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop' },
    { id: 4, name: 'Organic Cotton T-Shirt', price: 15000, category: 'fashion', rating: 4.5, numReviews: 56, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' },
    { id: 5, name: 'Leather Wallet', price: 25000, category: 'fashion', rating: 4.6, numReviews: 34, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop' },
    { id: 6, name: 'Bluetooth Speaker', price: 65000, category: 'electronics', rating: 4.4, numReviews: 47, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop' },
    { id: 7, name: 'Laptop Sleeve', price: 18000, category: 'electronics', rating: 4.3, numReviews: 22, image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400&h=400&fit=crop' },
    { id: 8, name: 'Premium Coffee Maker', price: 95000, category: 'home', rating: 4.8, numReviews: 31, image: 'https://images.unsplash.com/photo-1517668808822-9f02a4c0b8a8?w=400&h=400&fit=crop' },
    { id: 9, name: 'Running Shoes', price: 55000, category: 'sports', rating: 4.7, numReviews: 28, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop' },
    { id: 10, name: 'Desk Lamp', price: 32000, category: 'home', rating: 4.2, numReviews: 19, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop' },
    { id: 11, name: 'Skincare Set', price: 28000, category: 'beauty', rating: 4.6, numReviews: 33, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d5f6?w=400&h=400&fit=crop' },
    { id: 12, name: 'Cookbook', price: 12000, category: 'books', rating: 4.9, numReviews: 45, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop' },
  ]
  setProducts(mockProducts)
  setFilteredProducts(mockProducts)
  setLoading(false)
}
fetchProducts()
}, [])


useEffect(() => {
let result = [...products]


if (selectedCategory !== 'all') {
  result = result.filter(p => p.category === selectedCategory)
}


result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])


if (selectedRating > 0) {
  result = result.filter(p => p.rating >= selectedRating)
}


switch (sort) {
  case 'newest':
    result.sort((a, b) => b.id - a.id)
    break
  case 'price-asc':
    result.sort((a, b) => a.price - b.price)
    break
  case 'price-desc':
    result.sort((a, b) => b.price - a.price)
    break
  case 'rating':
    result.sort((a, b) => b.rating - a.rating)
    break
  default:
    break
}

setFilteredProducts(result)
}, [products, selectedCategory, priceRange, selectedRating, sort])

if (loading) {
return (
  <div className="max-w-7xl mx-auto px-4 py-20">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[1,2,3,4,5,6,7,8].map(i => (
        <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-80"></div>
      ))}
    </div>
  </div>
)
}

return (
<>

    <HeaderComponent />
    
    <main>
  <div className="max-w-7xl mx-auto px-4 py-20">
    {/* Header */}
    
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold">Shop</h1>
        <p className="text-gray-500 text-sm">{filteredProducts.length} products</p>
      </div>

      {/* Mobile Filter Button */}
      <button 
        onClick={() => setMobileFilterOpen(true)}
        className="md:hidden flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg"
      >
        <FaFilter /> Filters
      </button>
    </div>
    

    <div className="flex gap-8">
      {/* ——— FILTERS (Desktop) ——— */}
      
      <aside className="w-64 hidden md:block flex-shrink-0">
        <div className="sticky top-24 space-y-6">
          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-3">Categories</h3>
            <ul className="space-y-2 text-sm">
              {categories.map(cat => (
                <li key={cat}>
                  <label className="flex items-center gap-2 cursor-pointer capitalize hover:text-black">
                    <input 
                      type="radio" 
                      name="category" 
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                      className="accent-black"
                    />
                    {cat === 'all' ? 'All Products' : cat}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-semibold mb-3">Price Range</h3>
            <div className="flex items-center gap-3 text-sm">
              <span>₦{priceRange[0].toLocaleString()}</span>
              <input 
                type="range" 
                min="0" 
                max="200000" 
                step="5000"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="flex-1 accent-black"
              />
              <span>₦{priceRange[1].toLocaleString()}</span>
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="font-semibold mb-3">Rating</h3>
            <ul className="space-y-2 text-sm">
              {[4, 3, 2, 1].map(r => (
                <li key={r}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="rating" 
                      checked={selectedRating === r}
                      onChange={() => setSelectedRating(r)}
                      className="accent-black"
                    />
                    {r}★ & up
                  </label>
                </li>
              ))}
              <li>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="rating" 
                    checked={selectedRating === 0}
                    onChange={() => setSelectedRating(0)}
                    className="accent-black"
                  />
                  All ratings
                </label>
              </li>
            </ul>
          </div>
        </div>
      </aside>
      

      {/* ——— PRODUCTS ——— */}
      <div className="flex-1">
         <FadeIn>
          <PromotionBanner />
          </FadeIn>
     
        {/* Sort */}
        <div className="flex justify-end mb-6">
          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-black"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Best Rating</option>
          </select>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No products found</p>
            <button 
              onClick={() => {
                setSelectedCategory('all')
                setPriceRange([0, 200000])
                setSelectedRating(0)
              }}
              className="mt-4 text-black border border-black px-6 py-2 rounded hover:bg-black hover:text-white transition"
            >
              Clear filters
            </button>
          </div>
        ) : (
         
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
         
        )}
      </div>
    </div>
  </div>

  {/* ——— MOBILE FILTER OVERLAY ——— */}
  {mobileFilterOpen && (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilterOpen(false)} />
      <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={() => setMobileFilterOpen(false)}>
            <FaTimes size={24} />
          </button>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Categories</h3>
          <ul className="space-y-2 text-sm">
            {categories.map(cat => (
              <li key={cat}>
                <label className="flex items-center gap-2 cursor-pointer capitalize">
                  <input 
                    type="radio" 
                    name="category-mobile" 
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(cat)}
                    className="accent-black"
                  />
                  {cat === 'all' ? 'All Products' : cat}
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Price Range</h3>
          <div className="flex items-center gap-3 text-sm">
            <span>₦{priceRange[0].toLocaleString()}</span>
            <input 
              type="range" 
              min="0" 
              max="200000" 
              step="5000"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="flex-1 accent-black"
            />
            <span>₦{priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Rating</h3>
          <ul className="space-y-2 text-sm">
            {[4, 3, 2, 1].map(r => (
              <li key={r}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="rating-mobile" 
                    checked={selectedRating === r}
                    onChange={() => setSelectedRating(r)}
                    className="accent-black"
                  />
                  {r}★ & up
                </label>
              </li>
            ))}
            <li>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="rating-mobile" 
                  checked={selectedRating === 0}
                  onChange={() => setSelectedRating(0)}
                  className="accent-black"
                />
                All ratings
              </label>
            </li>
          </ul>
        </div>

        <button 
          onClick={() => setMobileFilterOpen(false)}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )}
  </main>
  <Footer />
</>
)
}