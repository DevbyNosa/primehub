import { query } from "../../config/database.js";

export async function getDashboardStats(req, res) {
  try {
    const userId = req.session.user.id;

    const totalOrders = await query(
      `SELECT COUNT(*) AS total_orders FROM orders WHERE user_id = $1`,
      [userId]
    );

    const totalSpent = await query(
      `SELECT COALESCE(SUM(total_amount), 0) as total FROM orders 
       WHERE user_id = $1 AND payment_status = 'paid'`,
      [userId]
    );

    const pendingOrders = await query(
      `SELECT COUNT(*) as count FROM orders 
       WHERE user_id = $1 AND status = 'pending' AND payment_status = 'pending'`,
      [userId]
    );

    const ordersThisMonth = await query(
      `SELECT COUNT(*) as count FROM orders 
       WHERE user_id = $1 AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)`,
      [userId]
    );

    const wishlistCount = await query(
      `SELECT COUNT(*) as count FROM wishlist WHERE user_id = $1`,
      [userId]
    );

    const recentOrders = await query(
      `SELECT id, order_number, total_amount, status, payment_status, created_at 
       FROM orders 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 5`,
      [userId]
    );

    const weeklySales = await query(
      `SELECT 
        DATE(created_at) as date,
        COALESCE(SUM(total_amount), 0) as total
       FROM orders 
       WHERE payment_status = 'paid' 
       AND created_at >= NOW() - INTERVAL '7 days'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    )

    res.json({
      success: true,
      stats: {
        totalOrders: parseInt(totalOrders.rows[0].total_orders),
        totalSpent: parseFloat(totalSpent.rows[0].total),
        pendingOrders: parseInt(pendingOrders.rows[0].count),
        ordersThisMonth: parseInt(ordersThisMonth.rows[0].count),
        wishlistCount: parseInt(wishlistCount.rows[0].count),
        recentOrders: recentOrders.rows,
        weeklySales: weeklySales.rows,
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
}