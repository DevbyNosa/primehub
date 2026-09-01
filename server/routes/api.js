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
  getCategoryBySlug 
} from '../controller/productController.js';
import { getWishlist, addToWishlist, removeFromWishlist, checkWishlist } from '../controller/wishlistController.js';
import upload from '../middleware/upload.js';
import { initializePayment, verifyPayment, webhook } from '../controller/payment/paymentController.js';
import { CustomerRouteProtection } from '../middleware/protectedRoute.js';
import { createOrder } from '../controller/orderController.js';

const router = express.Router();

// payment routes
router.post('/api/payment/webhook', express.raw({ type: 'application/json' }), webhook);
router.post('/api/payment/initialize', CustomerRouteProtection, initializePayment);
router.get('/api/payment/verify', CustomerRouteProtection, verifyPayment);

// Public routes
router.post("/api/subscribe/newsletter", newsLetterController);
router.post("/api/contact", contactController);
router.get("/api/products", getProducts);


router.get("/api/categories/:slug", getCategoryBySlug);  
router.get("/api/categories", getCategories);            

router.get("/api/category/:slug", getProductsByCategory);
router.get("/api/product/:slug", getProductBySlug);

// Wishlist routes (protected)
router.get("/api/wishlist", CustomerRouteProtection, getWishlist);
router.post("/api/wishlist", CustomerRouteProtection, addToWishlist);
router.delete("/api/wishlist/:id", CustomerRouteProtection, removeFromWishlist);
router.get("/check/:productId", CustomerRouteProtection, checkWishlist);


// order routes
router.post('/api/orders', CustomerRouteProtection, createOrder);


// Admin routes
router.post('/', upload.array('images', 5), createProducts);
router.patch("/api/patch/product", updateProduct);
router.patch("/api/patch/product/stock", updateProductStock);

export default router;