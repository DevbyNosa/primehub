// client/src/pages/AboutPage.jsx
import { Helmet } from 'react-helmet-async'
import { FaTruck, FaShieldAlt, FaHeadset, FaLeaf } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import HeaderComponent from '../components/Header';
import Footer from '../components/Footer';
import FadeIn from '../components/animations/FadeIn';
import StaggerChildren from '../components/animations/StaggerChildren';
import SlideIn from '../components/animations/SlideIn';

export default function AboutPage() {
  const [counts, setCounts] = useState({
    customers: 0,
    products: 0,
    secure: 0,
    support: 0
  })

   useEffect(() => {
   document.title = "About Us - PrimeHub"
 }, [])

  useEffect(() => {
    const target = { customers: 10000, products: 500, secure: 100, support: 24 }
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      setCounts({
        customers: Math.round(target.customers * progress),
        products: Math.round(target.products * progress),
        secure: Math.round(target.secure * progress),
        support: Math.round(target.support * progress)
      })
      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [])

  const features = [
    { icon: FaTruck, title: "Free Shipping", subtitle: "On orders over ₦50k", color: "text-blue-600 bg-blue-50" },
    { icon: FaShieldAlt, title: "Secure Payments", subtitle: "100% encrypted & safe", color: "text-emerald-600 bg-emerald-50" },
    { icon: FaHeadset, title: "Real Support", subtitle: "Human replies in minutes", color: "text-purple-600 bg-purple-50" },
    { icon: FaLeaf, title: "Built to Last", subtitle: "Premium quality guaranteed", color: "text-amber-600 bg-amber-50" }
  ]

  const testimonials = [
    { quote: "Best store ever. I got my stuff in under two days!", author: "Tunde", role: "Verified Buyer" },
    { quote: "I love the quality. Everything feels genuinely premium.", author: "Zainab", role: "Verified Buyer" },
    { quote: "Finally, a store that actually delivers on its promise.", author: "Chidi", role: "Verified Buyer" }
  ]

  return (
    <div className="min-h-screen bg-white text-black">
      
      
     
        <HeaderComponent />
      
     
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-28">
        
        <FadeIn>
        {/* ——— HERO ——— */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-8">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-black bg-neutral-100 border border-black/10 uppercase">
            Our Mission
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-black">
            We're PrimeHub
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 font-normal leading-relaxed">
            We curate products we actually love. No fluff, no junk—just high-grade gear built to last.
          </p>
        </section>
        </FadeIn>

       <SlideIn>
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-black tracking-tight">Why We Started</h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed text-base">
              <p>
                We grew tired of endless online stores selling low-quality items just to turn a profit. 
                So we built PrimeHub to serve as a filter for quality.
              </p>
              <p>
                Every single product listed on our platform is hand-picked, tested, and vetted by our own team. 
                If we wouldn't use it ourselves, we don't sell it.
              </p>
            </div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-black/10 shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop" 
              alt="PrimeHub Team" 
              className="rounded-xl w-full h-64 object-cover"
            />
            <p className="text-xs text-center text-neutral-400 mt-3 font-medium">The team behind PrimeHub</p>
          </div>
        </section>
        </SlideIn>

   
      <section className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-black">Why People Trust Us</h2>
          <p className="text-neutral-500 text-sm">Built around speed, quality, and complete transparency.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <FadeIn key={idx} delay={idx * 100}>
              <div className="bg-white p-6 rounded-2xl border border-black/10 shadow-sm hover:border-black transition-colors space-y-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                  <item.icon className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-black text-lg">{item.title}</h3>
                  <p className="text-xs text-neutral-500 mt-1">{item.subtitle}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
        {/* ——— TESTIMONIALS ——— Light Gray */}
        <section className="bg-black text-white rounded-3xl p-8 sm:p-12 space-y-10 border border-gray-200">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Real Stories, Real Customers</h2>
            <p className="text-neutral-500 text-sm">Don't take our word for it—see what our buyers have to say.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                <p className="text-sm italic text-neutral-600 leading-relaxed">"{item.quote}"</p>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="font-semibold text-sm text-black">{item.author}</p>
                  <p className="text-xs text-neutral-500">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

       
       <section className="bg-white text-black rounded-3xl p-8 sm:p-12 space-y-10 border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-neutral-800">
            <div className="pt-4 sm:pt-0">
              <p className="text-4xl sm:text-5xl font-extrabold text-gray-700">{counts.customers.toLocaleString()}+</p>
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-400 mt-2">Happy Customers</p>
            </div>
            <div className="pt-4 sm:pt-0">
              <p className="text-4xl sm:text-5xl font-extrabold text-gray-700">{counts.products}+</p>
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-400 mt-2">Curated Products</p>
            </div>
            <div className="pt-4 sm:pt-0">
              <p className="text-4xl sm:text-5xl font-extrabold text-gray-700">{counts.secure}%</p>
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-400 mt-2">Secure Checkout</p>
            </div>
            <div className="pt-4 sm:pt-0">
              <p className="text-4xl sm:text-5xl font-extrabold text-gray-700">{counts.support}/7</p>
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-400 mt-2">Live Support</p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}