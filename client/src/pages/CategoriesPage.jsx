import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'
import HeaderComponent from '../components/Header'
import Footer from '../components/Footer'

export default function CategoryProductsPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const catRes = await fetch('/api/categories')
        const catData = await catRes.json()
        
        if (catData.success) {
          setCategories(catData.categories || [])
        }
      } catch (error) {
        console.error(' Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <>
        <HeaderComponent />
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-80"></div>
            ))}
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <>
        <HeaderComponent />
        <div className="max-w-7xl my-20 mx-auto px-4 py-20 text-center h-[50vh] flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">No categories found</h1>
          <Link to="/shop" className="mt-4 inline-block text-black border border-black px-6 py-2 rounded hover:bg-black hover:text-white transition">
            Back to Shop
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Categories - PrimeHub</title>
      </Helmet>
      
      <HeaderComponent />
      
      <main className="max-w-7xl mx-auto px-4 py-20">
        <Link 
          to="/shop" 
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition mb-6"
        >
          <FaArrowLeft size={14} /> Back to Shop
        </Link>

       
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-gray-500 mt-1">{categories.length} categories available</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}  
              className="group relative overflow-hidden rounded-xl"
            >
              <img 
               
                src={cat.imageUrl || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop'} 
                alt={cat.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 flex items-end justify-start p-6">
                <div className="text-gray-100">
                  <h3 className="text-xl font-bold">{cat.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </>
  )
}