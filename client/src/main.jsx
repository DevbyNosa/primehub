import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async' 
import './index.css'
import App from './App.jsx'
import { CartProvider } from './components/context/CartContext.jsx'
import { WishlistProvider } from './components/context/WishlistContext.jsx'
import { AuthProvider } from './components/context/AuthContext.jsx'
import { API_URL } from '../config.js'

const nativeFetch = window.fetch.bind(window)
window.fetch = (input, init) => {
  if (typeof input === 'string' && input.startsWith('/api')) {
    return nativeFetch(`${API_URL}${input}`, init)
  }

  return nativeFetch(input, init)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>           
      <HelmetProvider>        
        <AuthProvider>      
          <CartProvider>      
            <WishlistProvider> 
              <App />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>,
)