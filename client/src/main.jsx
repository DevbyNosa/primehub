import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async' 
import './index.css'
import App from './App.jsx'
import { CartProvider } from './components/context/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
    <HelmetProvider>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </HelmetProvider>
    </CartProvider>
  </StrictMode>,
)
