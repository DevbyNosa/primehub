import { query } from "../config/database.js";


export const checkBanStatus = async (req, res, next) => {
  try {
   

    const userId = req.session.user.id;
    const result = await query(
      'SELECT is_active FROM users WHERE id = $1 AND role = $2',
      [userId, "customer"]
    );

    
    const user = Array.isArray(result) ? result[0] : result.rows?.[0];

    if (user && user.is_active === false) {
      req.session.destroy(() => {})
      return res.status(403).json({
        success: false,
        message: 'Sorry, you have been banned from this platform. Please contact support for more information.'
      });
    }

    next();
  } catch (error) {
    console.error('Check ban status error:', error);
    res.status(500).json({ success: false, message: 'Failed to check ban status' });
  }
};
