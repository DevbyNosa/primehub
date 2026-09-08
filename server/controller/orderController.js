import { query } from "../config/database.js";

export const viewOrderStats = async (req, res) => {
  try {
   const userId = req.session.user.id;
   
  } catch (error) {

  }
}

export const createOrder = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { items, subtotal, shipping, tax, total, address, paymentMethod } = req.body;

    
    const orderNumber = 'ORD-' + Date.now().toString().slice(-8);

    
    const order = await query(
      `INSERT INTO orders (
        user_id, order_number, total_amount, 
        shipping_address, shipping_city, shipping_state, 
        shipping_country, shipping_zip, phone, payment_method
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        userId,
        orderNumber,
        total,
        address.address,
        address.city,
        address.state,
        address.country,
        address.zipCode,
        address.phone,
        paymentMethod
      ]
    );

    
    for (const item of items) {
      await query(
        `INSERT INTO order_items (
          order_id, product_id, product_name, quantity, price, total
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          order.rows[0].id,
          item.id,
          item.name,
          item.quantity,
          item.price,
          item.price * item.quantity
        ]
      );
    }

    res.status(201).json({
      success: true,
      order: order.rows[0]
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
};

export const getCustomerOrders = async (req, res) => {
  try {
    const ordersResult = await query(
      `SELECT id, order_number, status, payment_status, total_amount, tracking_number, created_at
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.session.user.id]
    )

    const itemsResult = await query(
            `SELECT oi.id, oi.order_id, oi.product_id, oi.product_name, oi.quantity, oi.price,
              oi.total, oi.product_image,
              r.id AS review_id
       FROM order_items oi
             LEFT JOIN reviews r ON r.product_id = oi.product_id AND r.user_id = $1
       WHERE oi.order_id IN (
         SELECT id FROM orders WHERE user_id = $1
       )
       ORDER BY oi.id ASC`,
      [req.session.user.id]
    )

    const itemsByOrder = itemsResult.rows.reduce((items, item) => {
      if (!items[item.order_id]) items[item.order_id] = []
      items[item.order_id].push(item)
      return items
    }, {})

    res.json({
      success: true,
      orders: ordersResult.rows.map((order) => ({
        ...order,
        items: itemsByOrder[order.id] || []
      }))
    })
  } catch (error) {
    console.error('Get customer orders error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch orders' })
  }
}

export const createReview = async (req, res) => {
  try {
    const { orderId, productId, rating, comment } = req.body
    const userId = req.session.user.id

    if (!orderId || !productId || !rating || !comment?.trim() || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required' })
    }

    const purchase = await query(
      `SELECT o.id FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       WHERE o.id = $1 AND o.user_id = $2 AND oi.product_id = $3
         AND o.status IN ('shipped', 'delivered')`,
      [orderId, userId, productId]
    )

    if (purchase.rowCount === 0) {
      return res.status(403).json({ success: false, message: 'You can review shipped or delivered products you purchased' })
    }

    const review = await query(
      `INSERT INTO reviews (user_id, product_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, productId, rating, comment.trim()]
    )

    await query(
      `UPDATE products p
       SET ratings = stats.average_rating, num_reviews = stats.review_count, updated_at = NOW()
       FROM (
         SELECT product_id, AVG(rating)::numeric(3,2) AS average_rating, COUNT(*)::integer AS review_count
         FROM reviews WHERE product_id = $1 GROUP BY product_id
       ) stats
       WHERE p.id = stats.product_id`,
      [productId]
    )

    res.status(201).json({ success: true, review: review.rows[0] })
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'You have already reviewed this product' })
    }
    console.error('Create review error:', error)
    res.status(500).json({ success: false, message: 'Failed to submit review' })
  }
}


export const getAdminOrders = async (req, res) => {
  try {
    const result = await query(
      `SELECT o.*, u.name as customer_name,
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    )

    res.json({
      success: true,
      orders: result.rows
    })
  } catch (error) {
    console.error('Get admin orders error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    })
  }
}


export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      })
    }

    const result = await query(
      `UPDATE orders 
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    res.json({
      success: true,
      order: result.rows[0]
    })
  } catch (error) {
    console.error('Update order status error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    })
  }
}


export const getAdminOrderById = async (req, res) => {
  try {
    const { id } = req.params

    const orderResult = await query(
      `SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone_number as customer_phone
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = $1`,
      [id]
    )

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    const itemsResult = await query(
      `SELECT * FROM order_items WHERE order_id = $1`,
      [id]
    )

    res.json({
      success: true,
      order: orderResult.rows[0],
      items: itemsResult.rows
    })
  } catch (error) {
    console.error('Get admin order by id error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    })
  }
}