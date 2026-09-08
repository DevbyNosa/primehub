import express from 'express';
import axios from 'axios'; 
import { query } from '../config/database.js';  
import { RegisterAccount } from '../controller/Auth/registerController.js';
import { LoginAccount } from '../controller/Auth/loginController.js';
import { GoogleAuthRegistration, GoogleRoutes } from '../controller/Auth/googleController.js';
import { CustomerRouteProtection } from '../middleware/protectedRoute.js';
import { adminProtection } from '../middleware/protectedRoute.js';
import { checkBanStatus } from '../middleware/checkBanStatus.js';

const router = express.Router();

router.get('/google', GoogleRoutes);
router.get('/google/callback', GoogleAuthRegistration);

router.get("/me", CustomerRouteProtection, checkBanStatus, (req, res) => {
  
  res.json({ 
    success: true, 
    message: "Welcome to dashboard!",
    user: req.session.user 
  });
});

router.get("/admin", adminProtection, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Admin dashboard!",
    user: req.session.user
  })
})

router.post("/register", RegisterAccount);
router.post("/login", LoginAccount);


export default router;