// server/routes/adminRoutes.js
import express from 'express'
import { adminLogin } from '../controller/admin/loginController.js';
import { getAdminStats } from '../controller/admin/dashboardController.js';
import { adminProtection } from '../middleware/protectedRoute.js';
import { contactController } from '../controller/contactController.js'
import upload from '../middleware/upload.js';
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
import { getAdminOrders, updateOrderStatus, getAdminOrderById } from '../controller/orderController.js';
import { getAdminUsers, getAdminUserById, toggleUserStatus, deleteUser, updateAdminUser } from '../controller/admin/userController.js';
import { getReportData } from '../controller/admin/reportsController.js';
import { updateStoreSettings, getStoreSettings, changePasswordSettings } from '../controller/admin/settingController.js';
import { 
  getCategories as getAdminCategories,
  getCategoryById as getAdminCategoryById,
  createCategory,
  updateCategory,
  deleteCategory 
} from '../controller/admin/categoriesController.js';
import { LogOut } from '../controller/logoutController.js';
import { getAdminNotifications } from '../controller/admin/notificationController.js';
import { getAdminMessages, markAdminMessageAsRead } from '../controller/admin/messagesController.js';

const router = express.Router();

// ============ PUBLIC ROUTES ============
router.post("/login", adminLogin);

// ============ DASHBOARD ============
router.get("/stats", adminProtection, getAdminStats);
router.get('/reports', adminProtection, getReportData)
router.get('/notifications', adminProtection, getAdminNotifications)
router.get('/messages', adminProtection, getAdminMessages)
router.patch('/messages/:id/read', adminProtection, markAdminMessageAsRead)

// ============ PRODUCTS (Admin) ============
router.get('/products', adminProtection, getProducts);
router.get('/products/:id', adminProtection, getProductById);
router.post('/products', adminProtection, upload.array('images', 5), createProducts);
router.patch('/products/:id', adminProtection, upload.array('images', 5), updateProduct);
router.patch('/products/:id/stock', adminProtection, updateProductStock);
router.patch('/products/:id/toggle', adminProtection, toggleProductStatus);
router.delete('/products/:id', adminProtection, deleteProduct);

// ============ ORDERS (Admin) ============
router.get('/orders', adminProtection, getAdminOrders);
router.get('/orders/:id', adminProtection, getAdminOrderById);
router.patch('/orders/:id/status', adminProtection, updateOrderStatus);

// ============ USERS (Admin) ============
router.get('/users', adminProtection, getAdminUsers);
router.get('/users/:id', adminProtection, getAdminUserById);
router.patch('/users/:id', adminProtection, updateAdminUser);
router.patch('/users/:id/toggle', adminProtection, toggleUserStatus);
router.delete('/users/:id', adminProtection, deleteUser);

// ============ CATEGORIES (Admin) ============
router.get('/categories', adminProtection, getAdminCategories);
router.get('/categories/:id', adminProtection, getAdminCategoryById);
router.post('/categories', adminProtection, upload.single('image'), createCategory);
router.patch('/categories/:id', adminProtection, upload.single('image'), updateCategory);
router.delete('/categories/:id', adminProtection, deleteCategory);


router.get('/settings', adminProtection, getStoreSettings);
router.patch('/settings', adminProtection, updateStoreSettings);
router.patch('/settings/password', adminProtection, changePasswordSettings);

router.post("/logout", adminProtection, LogOut);

export default router;