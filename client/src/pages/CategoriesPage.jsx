// client/src/pages/CategoriesPage.jsx
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FaArrowRight } from 'react-icons/fa'
import HeaderComponent from '../components/Header'
import Footer from '../components/Footer'
import { useEffect } from 'react'
import FadeIn from '../components/animations/FadeIn'
import SlideIn from '../components/animations/SlideIn'

export default function CategoriesPage() {
  useEffect(() => {
   document.title = "Categories - PrimeHub"
  }, [])
  const categories = [
    {
      id: 1,
      name: 'Electronics',
      slug: 'electronics',
      description: 'Phones, laptops, headphones & more',
      count: 42,
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'Fashion',
      slug: 'fashion',
      description: 'Clothing, shoes, accessories',
      count: 35,
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop'
    },
    {
      id: 3,
      name: 'Home & Living',
      slug: 'home',
      description: 'Furniture, decor, kitchenware',
      count: 28,
      image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&h=400&fit=crop'
    },
    {
      id: 4,
      name: 'Beauty',
      slug: 'beauty',
      description: 'Skincare, makeup, hair care',
      count: 20,
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop'
    },
    {
      id: 5,
      name: 'Sports',
      slug: 'sports',
      description: 'Fitness, outdoor, equipment',
      count: 15,
      image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=600&h=400&fit=crop'
    },
    {
      id: 6,
      name: 'Books',
      slug: 'books',
      description: 'Fiction, non-fiction, e-books',
      count: 30,
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=400&fit=crop'
    }
  ]

  return (
    <>
   
      <HeaderComponent />
   
     <main>
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <SlideIn>
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Categories</h1>
          <p className="text-gray-500 mt-2">Browse products by category</p>
        </div>
        </SlideIn>

        {/* Categories Grid */}
        <FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-black transition-all duration-300 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden bg-gray-100">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">{category.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-black group-hover:translate-x-1 transition-transform whitespace-nowrap ml-4">
                    <span className="text-sm font-medium">{category.count}</span>
                    <FaArrowRight size={14} className="text-gray-400 group-hover:text-black transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        </FadeIn>

        {/* Quick Stats */}
        <div className="mt-16 bg-black text-white rounded-2xl p-8 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-3xl font-bold tracking-tight">{categories.length}</p>
              <p className="text-sm text-gray-400 mt-1">Categories</p>
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight">170+</p>
              <p className="text-sm text-gray-400 mt-1">Total Products</p>
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight">100%</p>
              <p className="text-sm text-gray-400 mt-1">Quality Guaranteed</p>
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight">✨</p>
              <p className="text-sm text-gray-400 mt-1">Curated Collections</p>
            </div>
          </div>
        </div>
      </div>
      </main>
      
        <Footer />
      

    </>
  )
}