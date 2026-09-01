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
import SettingsPage from './pages/Dashboard/SettingsPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import ProductDetailPage from './pages/ProductDetailsPage.jsx';
import PublicRoute from './auth/protection/PublicRoute.jsx';
import PaymentVerify from './pages/paymentVerify.jsx';
import OrderSuccessPage from './pages/OrderSuccess.jsx';

function App() {
  

  return (
    <Routes>
     <Route path="/" element={<HomePage />} />
     <Route path="/login" element={
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    } />

    <Route path="/register" element={
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    } />
     <Route path="/contact" element={<ContactPage />} />
     <Route path="/about" element={<AboutPage />} />
     <Route path="/shop" element={<ShopPage />} />
     <Route path="/categories" element={<CategoriesPage />}/>
    
     <Route path="/payment/verify" element={<PaymentVerify />} />
     <Route path="/product/:slug" element={<ProductDetailPage />} />
     
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

       <Route path="/dashboard/settings" element={
      <ProtectedRoute>
      <SettingsPage/>
      </ProtectedRoute>
      } />

       <Route path="/checkout" element={
      <ProtectedRoute>
       <CheckoutPage />
      </ProtectedRoute>
      } />

      <Route path="/order-success" element={
      <ProtectedRoute>
      <OrderSuccessPage />
      </ProtectedRoute>
      } />
    
     <Route path="*" element={<NotFound />} />

    
    </Routes>
  )
}

export default App
