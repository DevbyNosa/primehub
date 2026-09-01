
import { query } from "../config/database.js";


export const getWishlist = async (req, res) => {
  try {
    const userId = req.session.user.id;

    const result = await query(
      `SELECT p.*, w.id as wishlist_id 
       FROM wishlist w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = $1
       ORDER BY w.created_at DESC`,
      [userId]
    );

    res.json({ success: true, wishlist: result.rows });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch wishlist' });
  }
};


export const addToWishlist = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { productId } = req.body;

    
    const product = await query('SELECT id FROM products WHERE id = $1', [productId]);
    if (product.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const existing = await query(
      'SELECT id FROM wishlist WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Already in wishlist' });
    }

    const result = await query(
      `INSERT INTO wishlist (user_id, product_id)
       VALUES ($1, $2)
       RETURNING *`,
      [userId, productId]
    );

    res.status(201).json({ success: true, wishlistItem: result.rows[0] });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ success: false, message: 'Failed to add to wishlist' });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { id } = req.params;

    const result = await query(
      'DELETE FROM wishlist WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Wishlist item not found' });
    }

    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove from wishlist' });
  }
};


export const checkWishlist = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { productId } = req.params;

    const result = await query(
      'SELECT id FROM wishlist WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    res.json({ success: true, inWishlist: result.rows.length > 0 });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({ success: false, message: 'Failed to check wishlist' });
  }
};