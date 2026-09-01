// server/controller/payment/paymentController.js
import axios from "axios";
import { query } from "../../config/database.js";

const baseUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');

const extractOrderNumber = (tx_ref) => {
  const parts = tx_ref.split('-');
  return `${parts[1]}-${parts[2]}`; // "ORD-97782966"
};

export const initializePayment = async (req, res) => {
  try {
    const { orderId, amount, email, phone_number, name } = req.body;

    const response = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      {
        tx_ref: `primehub-${orderId}-${Date.now()}`,
        amount: amount,
        currency: "NGN",
        redirect_url: `${baseUrl}/payment/verify`,
        customer: {
          email: email,
          name: name,
          phone_number: phone_number
        },
        customizations: {
          title: "PrimeHub Payment",
          description: "Payment for your order on PrimeHub",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const tx_ref = response.data.data.tx_ref;

    // ✅ Save payment_reference to order
    await query(
      `UPDATE orders 
       SET payment_reference = $1 
       WHERE order_number = $2`,
      [tx_ref, orderId]
    );

    console.log('✅ Payment reference saved:', tx_ref);

    res.json({
      success: true,
      data: response.data.data,
    });

  } catch(error) {
    console.error('Error initializing payment:', error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred"
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { tx_ref, transaction_id } = req.query;

    if (!tx_ref) {
      return res.status(400).json({ success: false, message: 'Missing transaction reference' });
    }

    // Verify with Flutterwave
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
      }
    );

    const paymentData = response.data.data;

    if (paymentData.status === 'successful') {
      // ✅ Try payment_reference first
      let orderResult = await query(
        `SELECT id, user_id FROM orders WHERE payment_reference = $1`,
        [tx_ref]
      );

      // ✅ If not found, extract order number correctly
      if (orderResult.rows.length === 0) {
        const orderNumber = extractOrderNumber(tx_ref);
        console.log('📦 Looking up by order number:', orderNumber);
        
        orderResult = await query(
          `SELECT id, user_id FROM orders WHERE order_number = $1`,
          [orderNumber]
        );
      }

      if (orderResult.rows.length === 0) {
        console.log('❌ Order not found for reference:', tx_ref);
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      const order = orderResult.rows[0];
      console.log('✅ Order found:', order.id);

      // ✅ Update order
      await query(
        `UPDATE orders 
         SET status = 'processing', 
             payment_status = 'paid',
             payment_reference = $1,
             updated_at = NOW()
         WHERE id = $2`,
        [tx_ref, order.id]
      );

      // ✅ Save to payments
      await query(
        `INSERT INTO payments (
          order_id, user_id, amount, currency, 
          payment_method, transaction_reference, 
          payment_reference, status, gateway_response,
          customer_email, customer_phone, customer_name,
          completed_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())`,
        [
          order.id,
          order.user_id,
          paymentData.amount,
          paymentData.currency || 'NGN',
          paymentData.payment_type || 'bank_transfer',
          paymentData.tx_ref,
          paymentData.transaction_id,
          'success',
          JSON.stringify(paymentData),
          paymentData.customer?.email || null,
          paymentData.customer?.phone_number || null,
          paymentData.customer?.name || null
        ]
      );

      console.log('✅ Payment saved!');
      res.redirect(`${baseUrl}/order-success`);
      
    } else {
      console.log('❌ Payment failed:', paymentData.status);
      res.redirect(`${baseUrl}/payment-failed`);
    }
  } catch (error) {
    console.error('Verification error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
    });
  }
};

export const webhook = async (req, res) => {
  try {
    const event = req.body;

    const signature = req.headers['verif-hash'];
    if (signature !== process.env.FLW_SECRET_KEY) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (event.event === 'charge.completed') {
      const data = event.data;

      if (data.status === 'successful') {
        //  Find order by payment_reference or tx_ref
        let orderResult = await query(
          `SELECT id, user_id FROM orders WHERE payment_reference = $1`,
          [data.tx_ref]
        );

        if (orderResult.rows.length === 0) {
        const orderNumber = tx_ref.split('-').slice(1, 3).join('-');
          orderResult = await query(
            `SELECT id, user_id FROM orders WHERE order_number = $1`,
            [orderNumber]
          );
        }

        if (orderResult.rows.length > 0) {
          const order = orderResult.rows[0];

          await query(
            `UPDATE orders 
             SET status = 'processing', 
                 payment_status = 'paid',
                 payment_reference = $1,
                 updated_at = NOW()
             WHERE id = $2`,
            [data.tx_ref, order.id]
          );

          await query(
            `INSERT INTO payments (
              order_id, user_id, amount, currency, 
              payment_method, transaction_reference, 
              payment_reference, status, gateway_response,
              customer_email, customer_phone, customer_name,
              completed_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())`,
            [
              order.id,
              order.user_id,
              data.amount,
              data.currency || 'NGN',
              data.payment_type || 'bank_transfer',
              data.tx_ref,
              data.transaction_id,
              'success',
              JSON.stringify(data),
              data.customer?.email || null,
              data.customer?.phone_number || null,
              data.customer?.name || null
            ]
          );
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error);
    res.sendStatus(500);
  }
};