// client/src/components/home/Hero.jsx
import Button from "../Button"

const Hero = () => {
  return (
    <section className="min-h-[100vh] flex items-center justify-center bg-gray-50 text-white px-4">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-bold text-black">
          Shop Smart. <br className="block sm:hidden" /> Shop Prime.
        </h1>
        
        <p className="text-xl text-gray-700 mt-6">
          Discover premium products at unbeatable prices. Curated for the modern minimalist
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
        
          <Button 
            variant="primary" 
            to="/shop"
            size="large"
          >
            Shop Now
          </Button>
          
          
          <Button 
            variant="secondary" 
            to="/categories"
            size="large"
          >
            Explore Categories
          </Button>
        </div>
        
        <p className="text-sm text-gray-400 mt-6">
          ⭐ Free shipping on orders over ₦50,000
        </p>
      </div>
    </section>
  )
}

export default Hero