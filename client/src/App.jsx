import {Routes, Route, Link} from 'react-router-dom';
import { useState } from 'react'
import NotFound from './pages/NotFoundPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import CategoriesPage from './pages/CategoriesPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/Dashboard/DashboardPage.jsx';
import OrdersPage from './pages/Dashboard/OrdersPage.jsx';
import WishlistPage from './pages/Dashboard/WishlistPage.jsx';
import ProtectedRoute from './auth/protection/ProtectedRoute.jsx';
function App() {
  

  return (
    <Routes>
     <Route path="/" element={<HomePage />} />
     <Route path="/login" element={<LoginPage />} />
     <Route path="/contact" element={<ContactPage />} />
     <Route path="/about" element={<AboutPage />} />
     <Route path="/shop" element={<ShopPage />} />
     <Route path="/categories" element={<CategoriesPage />}/>
     <Route path="/register" element={<RegisterPage />} />
     <Route path="/dashboard" element={
      <ProtectedRoute>
      <DashboardPage />
      </ProtectedRoute>
      } />
     <Route path="/dashboard/orders" element={
      <ProtectedRoute>
      <OrdersPage />
      </ProtectedRoute>
      } />
     <Route path="/dashboard/wishlist" element={
      <ProtectedRoute>
      <WishlistPage />
      </ProtectedRoute>
      } />

     <Route path="*" element={<NotFound />} />

    
    </Routes>
  )
}

export default App
