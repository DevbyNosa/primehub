import { query } from '../../config/database.js';

export const getReportData = async (req, res) => {
  try {
    const { period = 'month' } = req.query

    // Get date range
    const now = new Date()
    let startDate = new Date()

    if (period === 'week') {
      startDate.setDate(now.getDate() - 7)
    } else if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1)
    } else if (period === 'year') {
      startDate.setFullYear(now.getFullYear() - 1)
    }

    // Total sales
    const totalRevenue = await query(
      `SELECT COALESCE(SUM(total_amount), 0) as total 
       FROM orders 
       WHERE payment_status = 'paid' 
       AND created_at >= $1`,
      [startDate]
    )

    // Total orders
    const totalOrders = await query(
      `SELECT COUNT(*) as count 
       FROM orders 
       WHERE created_at >= $1`,
      [startDate]
    )

    // New customers
    const newCustomers = await query(
      `SELECT COUNT(*) as count 
       FROM users 
       WHERE created_at >= $1`,
      [startDate]
    )

    // Daily data
    const dailyData = await query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        COALESCE(SUM(total_amount), 0) as revenue,
        COUNT(DISTINCT user_id) as customers
       FROM orders 
       WHERE created_at >= $1
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [startDate]
    )

    // Recent sales
    const recentSales = await query(
      `SELECT o.*, u.name as customer_name 
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.payment_status = 'paid'
       ORDER BY o.created_at DESC
       LIMIT 10`
    )

    // Calculate AOV
    const averageOrderValue = totalOrders.rows[0].count > 0 
      ? totalRevenue.rows[0].total / totalOrders.rows[0].count 
      : 0

    res.json({
      success: true,
      data: {
        totals: {
          revenue: parseFloat(totalRevenue.rows[0].total),
          orders: parseInt(totalOrders.rows[0].count),
          customers: parseInt(newCustomers.rows[0].count),
          averageOrderValue: parseFloat(averageOrderValue)
        },
        trends: {
          revenue: 12.5,
          orders: 8.3,
          customers: 5.2,
          averageOrderValue: 4.1
        },
        dailyData: dailyData.rows,
        recentSales: recentSales.rows
      }
    })
  } catch (error) {
    console.error('Report error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate report'
    })
  }
}