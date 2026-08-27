
export function CustomerRouteProtection(req, res, next) {
  try {
    if (!req.session.user) {
      // ✅ Return 401 (Unauthorized) instead of redirect
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

    next();

  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
}