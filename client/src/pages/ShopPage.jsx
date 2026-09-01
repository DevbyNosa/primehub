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

const [selectedCategory, setSelectedCategory] = useState('all')
const [priceRange, setPriceRange] = useState([0, 1000000])
const [selectedRating, setSelectedRating] = useState(0)

const categories = ['all', 'electronics', 'fashion', 'home', 'beauty', 'sports', 'books']


useEffect(() => {
  document.title = "Shop - PrimeHub";
}, []);


useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      params.append('minPrice', priceRange[0]);
      params.append('maxPrice', priceRange[1]);

      if (selectedRating > 0) {
        params.append('rating', selectedRating);
      }

      params.append('sort', sort);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
        setFilteredProducts(data.products);
      }
    } catch (error) {
      console.error('Fetch products error:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [selectedCategory, priceRange, selectedRating, sort]);

return (
<>
<HeaderComponent />
<main>
<div className="max-w-7xl mx-auto px-4 py-20">
  
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
    <div>
      <h1 className="text-3xl font-bold">Shop</h1>
      <p className="text-gray-500 text-sm">{filteredProducts.length} products</p>
    </div>

    <button 
      onClick={() => setMobileFilterOpen(true)}
      className="md:hidden flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg"
    >
      <FaFilter /> Filters
    </button>
  </div>

  <div className="flex gap-8">
    
    <aside className="w-64 hidden md:block flex-shrink-0">
      <div className="sticky top-24 space-y-6">
      
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

      
        <div>
          <h3 className="font-semibold mb-3">Price Range</h3>
          <div className="flex items-center gap-3 text-sm">
            <span>₦{priceRange[0].toLocaleString()}</span>
            <input 
              type="range" 
              min="0" 
              max="1000000" 
              step="5000"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="flex-1 accent-black"
            />
            <span>₦{priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        
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

      
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="flex items-center gap-3 text-sm">
          <span>₦{priceRange[0].toLocaleString()}</span>
          <input 
            type="range" 
            min="0" 
            max="1000000"
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