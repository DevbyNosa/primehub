import { query } from '../../config/database.js'

export const getAdminNotifications = async (req, res) => {
  try {
    const [orders, users, products, messages] = await Promise.all([
      query(`
        SELECT id, order_number, total_amount, status, created_at
        FROM orders
        ORDER BY created_at DESC
        LIMIT 20
      `),
      query(`
        SELECT id, name, email, created_at
        FROM users
        WHERE role = 'customer'
        ORDER BY created_at DESC
        LIMIT 20
      `),
      query(`
        SELECT id, name, stock_quantity, updated_at
        FROM products
        WHERE is_active = true AND stock_quantity <= 5
        ORDER BY stock_quantity ASC, updated_at DESC
        LIMIT 20
      `),
      query(`
        SELECT id, name, email, subject, created_at
        FROM contact
        WHERE is_read = false
        ORDER BY created_at DESC
        LIMIT 20
      `)
    ])

    const notifications = [
      ...orders.rows.map((order) => ({
        id: `order-${order.id}`,
        type: 'order',
        title: `New order ${order.order_number}`,
        message: `Order worth ₦${Number(order.total_amount).toLocaleString()} is ${order.status || 'pending'}.`,
        createdAt: order.created_at,
        href: `/admin/orders/${order.id}`
      })),
      ...users.rows.map((user) => ({
        id: `user-${user.id}`,
        type: 'user',
        title: 'New customer registered',
        message: `${user.name} joined with ${user.email}.`,
        createdAt: user.created_at,
        href: '/admin/users'
      })),
      ...products.rows.map((product) => ({
        id: `product-${product.id}`,
        type: 'stock',
        title: product.stock_quantity === 0 ? 'Product is out of stock' : 'Low stock alert',
        message: `${product.name} has ${product.stock_quantity} item${product.stock_quantity === 1 ? '' : 's'} left.`,
        createdAt: product.updated_at,
        href: '/admin/products'
      })),
      ...messages.rows.map((message) => ({
        id: `message-${message.id}`,
        type: 'message',
        title: 'Unread contact message',
        message: `${message.name || message.email}: ${message.subject || 'No subject'}`,
        createdAt: message.created_at,
        href: '/admin/messages'
      }))
    ].sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt))

    res.json({
      success: true,
      notifications,
      counts: {
        orders: orders.rowCount,
        users: users.rowCount,
        lowStock: products.rowCount,
        messages: messages.rowCount
      }
    })
  } catch (error) {
    console.error('Admin notifications error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin notifications'
    })
  }
}