// client/src/components/NavBar.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaBars, FaTimes, FaShoppingCart, FaUser } from 'react-icons/fa'
import { useCart } from './context/CartContext'
import navBarLogo from '../assets/primehub_title.png'
import SearchBar from './SearchBar'
import CheckoutSidebar from './home/CheckoutSidebar'

export default function NavBarComponent() {
  const { totalItems } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  
const navLinkArray = [
  { id: 1, route: "/", name: "Home" },
  { id: 2, route: "/about", name: "About" },
  { id: 3, route: "/shop", name: "Shop" },
  { id: 4, route: "/categories", name: "Categories" },
  { id: 5, route: "/contact", name: "Contact" }  
]

  return (
    <nav className='flex justify-between items-center p-1 bg-gray-100 w-[100%] shadow-sm fixed top-0 left-0 z-50'>
      {/* Logo */}
      <img className='w-15 ml-2 cursor-pointer rounded-sm' src={navBarLogo} alt="Primehub Logo" />

     
      <ul className='flex gap-6 font-medium hidden md:flex'>
        {navLinkArray.map((items) => (
          <li key={items.id}><Link to={items.route}>{items.name}</Link></li>
        ))}
      </ul>

     
      <ul className='flex gap-3 items-center mr-2'>
        <li><SearchBar /></li>
        
       
        <li 
          className="relative cursor-pointer" 
          onClick={() => setIsCartOpen(true)}
        >
          <FaShoppingCart size={24} />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </li>

        <li><Link to="/login"><FaUser size={24}/></Link></li>

      
        <li className='md:hidden'>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </li>
      </ul>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-gray-100 shadow-lg z-50 md:hidden">
          <ul className='flex flex-col p-4 gap-4 font-medium'>
            {navLinkArray.map((items) => (
              <li key={items.id}>
                <Link 
                  to={items.route} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 px-4 hover:bg-gray-200 rounded"
                >
                  {items.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Cart Sidebar */}
      <CheckoutSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </nav>
  )
}