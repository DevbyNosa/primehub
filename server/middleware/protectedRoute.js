
import { query } from '../config/database.js';

export async function CustomerRouteProtection(req, res, next) {
  try {
    if (!req.session.user) {
   
      return res.status(401).json({
        success: false,
        message: 'Not authenticated. Please login.'
      });
    }

    if (req.session.user.role !== 'customer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Customer only.'
      });
    }

    const result = await query(
      'SELECT is_active FROM users WHERE id = $1 AND role = $2',
      [req.session.user.id, 'customer']
    )

    const isBanned = [false, 0, 'false', '0'].includes(result.rows[0]?.is_active)

    if (isBanned) {
      req.session.destroy(() => {})
      return res.status(403).json({
        success: false,
        code: 'USER_BANNED',
        message: 'Sorry, you have been banned from this platform.'
      })
    }

    next();

  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
}

export const adminProtection = (req, res, next) => {
  try {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
} catch(error) {
   console.error('Auth error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  
}
};