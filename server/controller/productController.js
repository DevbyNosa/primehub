import express from 'express';
import { query } from '../config/database.js';
import upload from '../middleware/upload.js';
import { slugify, generateUniqueSlug } from '../utils/slugify.js';

 
export async function getProducts(req, res) {
  try {
    const { category, minPrice, maxPrice, rating, sort } = req.query;

    let queryText = `
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `;

    const values = [];
    let index = 1;

    if (category && category !== 'all') {
      queryText += ` AND c.slug = $${index}`;
      values.push(category);
      index++;
    }

    if (minPrice) {
      queryText += ` AND p.price >= $${index}`;
      values.push(minPrice);
      index++;
    }

    if (maxPrice) {
      queryText += ` AND p.price <= $${index}`;
      values.push(maxPrice);
      index++;
    }

    if (rating && rating > 0) {
      queryText += ` AND p.ratings >= $${index}`;
      values.push(rating);
      index++;
    }

    if (sort === 'price-asc') {
      queryText += ` ORDER BY p.price ASC`;
    } else if (sort === 'price-desc') {
      queryText += ` ORDER BY p.price DESC`;
    } else if (sort === 'rating') {
      queryText += ` ORDER BY p.ratings DESC`;
    } else {
      queryText += ` ORDER BY p.created_at DESC`;
    }

    const result = await query(queryText, values);
    res.json({ success: true, products: result.rows });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
}


export async function getCategories(req, res) {
  try {
    const result = await query(`
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.is_active = true
      GROUP BY c.id
      ORDER BY c.name ASC
    `);
    
    
    const categories = result.rows.map(cat => ({
      id: cat.id,
      title: cat.name,
      slug: cat.slug,
      path: `/categories/${cat.slug}`,
      imageUrl: cat.image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop',
      
    }));
    
    res.json({ success: true, categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
}

export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await query('SELECT * FROM categories WHERE slug = $1', [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, category: result.rows[0] });
  } catch (error) {
    console.error('Get category by slug error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch category' });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params
    const result = await query('SELECT * FROM products WHERE slug = $1', [slug])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }
    
    res.json({ success: true, product: result.rows[0] })
  } catch (error) {
    console.error('Get product by slug error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch product' })
  }
}

export const createProducts = async (req, res) => {
  try {
    const { name, description, price, compare_price, stock_quantity, category_id } = req.body;

   
    if (!name || !description || !price || !stock_quantity) {
      return res.status(400).json({
        success: false,
        message: "Please enter all required fields"
      });
    }

   
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => file.path); 
    }

    const baseSlug = slugify(name);
    const slug = await generateUniqueSlug(baseSlug);

    if (category_id) {
      const categoryCheck = await query('SELECT id FROM categories WHERE id = $1', [category_id]);
      if (categoryCheck.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    const response = await query(
      `INSERT INTO products (name, slug, description, price, compare_price, stock_quantity, category_id, images)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, slug, description, price, compare_price || null, stock_quantity, category_id || null, imageUrls]
    );
    
    res.status(201).json({ 
      success: true, 
      product: response.rows[0] 
    });

  } catch(error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const category = await query('SELECT id FROM categories WHERE slug = $1', [slug]);
    if (category.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }
    
    const result = await query(
      `SELECT p.*, c.name as category_name 
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.category_id = $1 AND p.is_active = true
       ORDER BY p.created_at DESC`,
      [category.rows[0].id]
    );
    
    res.json({ 
      success: true, 
      products: result.rows 
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch products' 
    });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, price, compare_price, stock_quantity, category_id, images, is_active, is_featured } = req.body;

   
    const productCheck = await query('SELECT * FROM products WHERE id = $1', [id]);
    if (productCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = productCheck.rows[0];

    
    const updates = [];
    const values = [];
    let index = 1;

    if (name !== undefined) {
      updates.push(`name = $${index++}`);
      values.push(name);
    }
    if (slug !== undefined) {
      
      const slugCheck = await query(
        'SELECT id FROM products WHERE slug = $1 AND id != $2',
        [slug, id]
      );
      if (slugCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Product slug already exists'
        });
      }
      updates.push(`slug = $${index++}`);
      values.push(slug);
    }
    if (description !== undefined) {
      updates.push(`description = $${index++}`);
      values.push(description);
    }
    if (price !== undefined) {
      updates.push(`price = $${index++}`);
      values.push(price);
    }
    if (compare_price !== undefined) {
      updates.push(`compare_price = $${index++}`);
      values.push(compare_price);
    }
    if (stock_quantity !== undefined) {
      updates.push(`stock_quantity = $${index++}`);
      values.push(stock_quantity);
    }
    if (category_id !== undefined) {
      
      const categoryCheck = await query('SELECT id FROM categories WHERE id = $1', [category_id]);
      if (categoryCheck.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }
      updates.push(`category_id = $${index++}`);
      values.push(category_id);
    }
    if (images !== undefined) {
      updates.push(`images = $${index++}`);
      values.push(images);
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${index++}`);
      values.push(is_active);
    }
    if (is_featured !== undefined) {
      updates.push(`is_featured = $${index++}`);
      values.push(is_featured);
    }

    
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

   
    updates.push(`updated_at = NOW()`);

   
    const queryText = `
      UPDATE products 
      SET ${updates.join(', ')}
      WHERE id = $${index}
      RETURNING *
    `;
    values.push(id);

    const result = await query(queryText, values);

    res.json({
      success: true,
      product: result.rows[0]
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
};


export const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_quantity } = req.body;

    if (stock_quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'stock_quantity is required'
      });
    }

    const result = await query(
      `UPDATE products 
       SET stock_quantity = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [stock_quantity, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product: result.rows[0]
    });

  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update stock'
    });
  }
};