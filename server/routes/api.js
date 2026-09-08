// server/routes/productRoutes.js
import express from 'express'
import { newsLetterController } from '../controller/newLetterController.js';
import { contactController } from '../controller/contactController.js';
import { 
  getProducts, 
  getProductsByCategory, 
  getProductBySlug, 
  createProducts, 
  updateProduct, 
  updateProductStock, 
  getCategories, 
  getCategoryBySlug,
  toggleProductStatus,
  deleteProduct,
  getProductById
} from '../controller/productController.js';
import { getWishlist, addToWishlist, removeFromWishlist, checkWishlist } from '../controller/wishlistController.js';
import upload from '../middleware/upload.js';
import { initializePayment, verifyPayment, webhook } from '../controller/payment/paymentController.js';
import { CustomerRouteProtection } from '../middleware/protectedRoute.js';
import { createOrder, getCustomerOrders, createReview } from '../controller/orderController.js';
import { getDashboardStats } from '../controller/Dashboard/dashboardController.js';
import { adminProtection } from '../middleware/protectedRoute.js';
import { checkBanStatus } from '../middleware/checkBanStatus.js';
import { LogOut } from '../controller/logoutController.js';

const router = express.Router();

//
// ============ PAYMENT ROUTES ============
router.post('/api/payment/webhook', express.raw({ type: 'application/json' }), webhook);
router.post('/api/payment/initialize', CustomerRouteProtection, initializePayment);
router.get('/api/payment/verify', CustomerRouteProtection, verifyPayment);

// ============ PUBLIC ROUTES ============
router.post("/api/subscribe/newsletter", newsLetterController);
router.post("/api/contact", contactController);
router.get("/api/products", getProducts);
router.get("/api/categories/:slug", getCategoryBySlug);  
router.get("/api/categories", getCategories);            
router.get("/api/category/:slug", getProductsByCategory);
router.get("/api/product/:slug", getProductBySlug);

// ============ WISHLIST ROUTES ============
router.get("/api/wishlist", CustomerRouteProtection, getWishlist);
router.post("/api/wishlist", CustomerRouteProtection, addToWishlist);
router.delete("/api/wishlist/:id", CustomerRouteProtection, removeFromWishlist);
router.get("/check/:productId", CustomerRouteProtection, checkWishlist);
router.patch('/products/:id/toggle', CustomerRouteProtection, toggleProductStatus);

// ============ ORDER ROUTES ============
router.post('/api/orders', CustomerRouteProtection, createOrder);
router.get('/api/customer/orders', CustomerRouteProtection, getCustomerOrders);
router.post('/api/reviews', CustomerRouteProtection, createReview);

// ============ DASHBOARD ROUTES ============
router.get("/api/customer/dashboard/stats", CustomerRouteProtection, getDashboardStats);
// Logout must remain available to banned users so they can clear their session.
router.post("/api/logout", LogOut)




export default router;