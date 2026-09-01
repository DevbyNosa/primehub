import express from 'express';
import axios from 'axios'; 
import { query } from '../config/database.js';  
import { RegisterAccount } from '../controller/Auth/registerController.js';
import { LoginAccount } from '../controller/Auth/loginController.js';
import { GoogleAuthRegistration, GoogleRoutes } from '../controller/Auth/googleController.js';
import { CustomerRouteProtection } from '../middleware/protectedRoute.js';


const router = express.Router();

router.get('/google', GoogleRoutes);
router.get('/google/callback', GoogleAuthRegistration);

router.get("/me", CustomerRouteProtection, (req, res) => {
  
  res.json({ 
    success: true, 
    message: "Welcome to dashboard!",
    user: req.session.user 
  });
});

router.post("/register", RegisterAccount);
router.post("/login", LoginAccount);


export default router;