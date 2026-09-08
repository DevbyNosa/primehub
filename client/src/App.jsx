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
import AdminLogin from './pages/admin/LoginPage.jsx';
import AdminProtectedRoute from './auth/protection/adminProtectedRoute.jsx';
import AdminDashboard from './pages/admin/Dashboard/adminDashboard.jsx';
import AdminProducts from './pages/admin/Dashboard/AdminProducts.jsx';
import AdminAddProduct from './pages/admin/Dashboard/AdminAddProduct.jsx';
import AdminEditProduct from './pages/admin/Dashboard/AdminPatchProduct.jsx';
import AdminOrders from './pages/admin/Dashboard/AdminOrders.jsx';
import AdminOrderDetail from './pages/admin/Dashboard/AdminViewOrder.jsx';
import AdminUsers from './pages/admin/Dashboard/AdminUsers.jsx';
import AdminReports from './pages/admin/Dashboard/ReportPage.jsx';
import AdminSettings from './pages/admin/Dashboard/SettingsPage.jsx';
import AdminCategories from './pages/admin/Dashboard/CategoryPage.jsx';
import AdminNotifications from './pages/admin/Dashboard/NotificationsPage.jsx';
import AdminMessages from './pages/admin/Dashboard/MessagesPage.jsx';

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

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path='/admin/dashboard' element={
        <AdminProtectedRoute>
          <AdminDashboard />
        </AdminProtectedRoute>
      } />
      <Route path='/admin/products' element={
        <AdminProtectedRoute>
          <AdminProducts />
        </AdminProtectedRoute>
      } />
      <Route path='/admin/products/new' element={
        <AdminProtectedRoute>
          <AdminAddProduct />
        </AdminProtectedRoute>
      } />
    <Route path="/admin/products/edit/:id" element={
      <AdminProtectedRoute>
        <AdminEditProduct />
      </AdminProtectedRoute>
      } />

      <Route path='/admin/orders' element={
         <AdminProtectedRoute>
          <AdminOrders />
         </AdminProtectedRoute>
      } />
      
    <Route path='/admin/orders/:id' element={
      <AdminProtectedRoute>
        <AdminOrderDetail />
      </AdminProtectedRoute>
    } />

    <Route path='/admin/users' element={
      <AdminProtectedRoute>
        <AdminUsers />
      </AdminProtectedRoute>
    } />

    <Route path="/admin/reports" element={
      <AdminProtectedRoute>
        <AdminReports />
      </AdminProtectedRoute>
    } />

    <Route path="/admin/settings" element={
      <AdminProtectedRoute>
        <AdminSettings />
      </AdminProtectedRoute>
    } />

    <Route path="/admin/categories" element={
      <AdminProtectedRoute>
        <AdminCategories />
      </AdminProtectedRoute>
    } />

    <Route path="/admin/notifications" element={
      <AdminProtectedRoute>
        <AdminNotifications />
      </AdminProtectedRoute>
    } />

    <Route path="/admin/messages" element={
      <AdminProtectedRoute>
        <AdminMessages />
      </AdminProtectedRoute>
    } />
    
    

     <Route path="*" element={<NotFound />} />

    
    </Routes>
  )
}

export default App
