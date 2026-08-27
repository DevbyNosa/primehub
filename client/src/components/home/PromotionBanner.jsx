// client/src/components/home/PromotionBanner.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const promotions = [
  {
    title: 'Up to 40% Off',
    subtitle: 'On selected electronics',
    cta: 'Shop Now',
    link: '/shop?category=electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop',
  },
  {
    title: 'Buy 1 Get 1 Free',
    subtitle: 'On all fashion items',
    cta: 'Shop Now',
    link: '/shop?category=fashion',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop',
  },
  {
    title: 'Free Shipping',
    subtitle: 'On orders over ₦50,000',
    cta: 'Shop Now',
    link: '/shop',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=200&h=200&fit=crop',
  }
]

export default function PromotionBanner() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % promotions.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const promo = promotions[current]

  return (
    <div className="relative bg-black rounded-xl overflow-hidden mb-6">
      {/* Background gradient accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
      
      <div className="relative flex items-center justify-between p-5 md:p-7">
        {/* Text Content */}
        <div className="flex-1">
          <span className="inline-block text-xs font-medium tracking-wider text-white/60 uppercase mb-1">
            Offer {current + 1} of {promotions.length}
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-white">
            {promo.title}
          </h3>
          <p className="text-sm text-white/70 mt-1">
            {promo.subtitle}
          </p>
          <Link 
            to={promo.link} 
            className="inline-flex items-center gap-2 mt-4 bg-white text-black text-sm font-medium px-5 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {promo.cta}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Image */}
        <div className="hidden sm:block w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-white/10 flex-shrink-0 ml-4">
          <img 
            src={promo.image} 
            alt={promo.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 pb-4">
        {promotions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1 rounded-full transition-all duration-300 ${
              current === index ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}