import { query } from '../../config/database.js';
import { slugify } from '../../utils/slugify.js';


export const getCategories = async (req, res) => {
  try {
    const result = await query(
      `SELECT c.*, 
        COUNT(p.id) as product_count
       FROM categories c
       LEFT JOIN products p ON p.category_id = c.id
       GROUP BY c.id
       ORDER BY c.created_at DESC`
    );

    res.json({
      success: true,
      categories: result.rows
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
};


export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT c.*, 
        COUNT(p.id) as product_count
       FROM categories c
       LEFT JOIN products p ON p.category_id = c.id
       WHERE c.id = $1
       GROUP BY c.id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      category: result.rows[0]
    });
  } catch (error) {
    console.error('Get category by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category'
    });
  }
};


export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

   
    let imageUrl = null;
    if (req.file) {
      imageUrl = req.file.path; // Cloudinary URL
    }

    const slug = slugify(name);

    // Check if slug exists
    const existing = await query(
      'SELECT id FROM categories WHERE slug = $1',
      [slug]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists'
      });
    }

    const result = await query(
      `INSERT INTO categories (name, slug, description, image)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, slug, description || null, imageUrl]
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: result.rows[0]
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category'
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    const slug = slugify(name);

    
    const existing = await query(
      'SELECT id FROM categories WHERE slug = $1 AND id != $2',
      [slug, id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists'
      });
    }

    
    let imageUrl = null;
    if (req.file) {
      imageUrl = req.file.path;
    }

   
    let queryText = `
      UPDATE categories 
      SET name = $1, 
          slug = $2, 
          description = $3,
          updated_at = NOW()
    `;
    const values = [name, slug, description || null];
    let paramCount = 4;

    if (imageUrl) {
      queryText += `, image = $${paramCount}`;
      values.push(imageUrl);
      paramCount++;
    }

    queryText += ` WHERE id = $${paramCount} RETURNING *`;
    values.push(id);

    const result = await query(queryText, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      category: result.rows[0]
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category'
    });
  }
};


export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    
    const check = await query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    
    const products = await query(
      'SELECT COUNT(*) as count FROM products WHERE category_id = $1',
      [id]
    );

    if (parseInt(products.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with products. Remove products first.'
      });
    }

    await query(
      'DELETE FROM categories WHERE id = $1',
      [id]
    );

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category'
    });
  }
};