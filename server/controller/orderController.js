import { query } from "../config/database.js";


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