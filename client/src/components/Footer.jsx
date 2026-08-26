
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="w-[90%] max-w-7xl mx-auto py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          
         
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-2xl font-bold mb-4">PrimeHub</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium products curated for the modern minimalist.
            </p>
            <p className="text-gray-500 text-xs mt-4">© 2024 PrimeHub. All rights reserved.</p>
          </div>

        
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><Link to="/shop" className="text-gray-400 hover:text-white transition">Shop</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition">About</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

        
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faqs" className="text-gray-400 hover:text-white transition">FAQs</Link></li>
              <li><Link to="/shipping" className="text-gray-400 hover:text-white transition">Shipping</Link></li>
              <li><Link to="/returns" className="text-gray-400 hover:text-white transition">Returns</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>

          
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition text-xl">
                <FaFacebook />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition text-xl">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition text-xl">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition text-xl">
                <FaYoutube />
              </a>
            </div>
            <p className="text-gray-500 text-xs mt-4">Follow us for updates &amp; offers</p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
          <p>© 2024 PrimeHub. All rights reserved.</p>
          <div className="flex gap-6 mt-2 sm:mt-0">
            <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}