
import { query } from '../config/database.js';

export const CustomerRouteProtection = (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated. Please login.'
      });
    }

    
    if (req.session.user.role !== 'customer' && req.session.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Customer or Admin only.'
      });
    }

    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

export const adminProtection = (req, res, next) => {
  try {
    //  Debug logs
    console.log('🔍 adminProtection called');
    console.log('🔍 Session ID:', req.sessionID);
    console.log('🔍 Session object:', req.session);
    console.log('🔍 User in session:', req.session?.user);
    console.log('🔍 User role:', req.session?.user?.role);

    
    if (!req.session) {
      console.log('❌ No session found');
      return res.status(401).json({
        success: false,
        message: 'No session found. Please login.'
      });
    }

    
    if (!req.session.user) {
      console.log('❌ No user in session');
      return res.status(401).json({
        success: false,
        message: 'Not authenticated. Please login.'
      });
    }

    
    if (req.session.user.role !== 'admin') {
      console.log('❌ User is not admin, role is:', req.session.user.role);
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    console.log('✅ Admin access granted');
    next();

  } catch (error) {
    console.error('Admin auth error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};