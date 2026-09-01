// client/src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async' 
import './index.css'
import App from './App.jsx'
import { CartProvider } from './components/context/CartContext.jsx'
import { WishlistProvider } from './components/context/WishlistContext.jsx'
import { AuthProvider } from './components/context/AuthContext.jsx'

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