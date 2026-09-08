import { query } from "../../config/database.js";

export const getAdminStats = async (req, res) => {
  try {
    // Total Users
    const totalUsers = await query('SELECT COUNT(*) as count FROM users');

    // Total Products
    const totalProducts = await query('SELECT COUNT(*) as count FROM products');

    // Total Orders
    const totalOrders = await query('SELECT COUNT(*) as count FROM orders');

    // Total Revenue (paid orders)
    const totalRevenue = await query(
      `SELECT COALESCE(SUM(total_amount), 0) as total 
       FROM orders WHERE payment_status = 'paid'`
    );

    // Weekly sales for the last 7 days
    const weeklySales = await query(
      `SELECT 
        DATE(created_at) as date,
        COALESCE(SUM(total_amount), 0) as total
       FROM orders 
       WHERE payment_status = 'paid' 
         AND created_at >= NOW() - INTERVAL '7 days'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    );

    // Recent Orders (last 5)
    const recentOrders = await query(
      `SELECT o.*, u.name as customer_name 
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC 
       LIMIT 5`
    );

    // Orders by status
    const ordersByStatus = await query(
      `SELECT status, COUNT(*) as count 
       FROM orders 
       GROUP BY status`
    );

    res.json({
      success: true,
      stats: {
        totalUsers: parseInt(totalUsers.rows[0].count),
        totalProducts: parseInt(totalProducts.rows[0].count),
        totalOrders: parseInt(totalOrders.rows[0].count),
        totalRevenue: parseFloat(totalRevenue.rows[0].total),
        recentOrders: recentOrders.rows,
        ordersByStatus: ordersByStatus.rows,
        weeklySales: weeklySales.rows
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin stats'
    });
  }
};