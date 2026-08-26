// client/src/components/SearchBar.jsx
import { useState } from 'react'
import { FaSearch, FaTimes } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false)  // ← Toggle switch
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setIsOpen(false)  // ← Close after search
    }
  }

  return (
    <>
      {/* Mobile: Search Icon (visible on small screens) */}
      <button
        className="md:hidden"  // ← Hidden on tablet/desktop
        onClick={() => setIsOpen(true)}  // ← Open search
      >
        <FaSearch size={24} />
      </button>

      {/* Mobile: Full-screen Search Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4 md:hidden">
          <div className="w-full max-w-md">
            <div className="flex items-center gap-3">
              <form onSubmit={handleSearch} className="flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  autoFocus
                />
              </form>
              <button
                onClick={() => setIsOpen(false)}  // ← Close search
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FaTimes size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop: Full Search Bar (hidden on mobile) */}
      <form
        onSubmit={handleSearch}
        className="hidden md:flex items-center relative"
      >
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
        />
        <button
          type="submit"
          className="absolute right-3 text-gray-400 hover:text-black"
        >
          <FaSearch size={18} />
        </button>
      </form>
    </>
  )
}

export default SearchBar