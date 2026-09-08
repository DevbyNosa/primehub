import { query } from "../../config/database.js"
//  Get all users (admin)
export const getAdminUsers = async (req, res) => {
  try {
    const result = await query(
      `SELECT u.*, 
        (SELECT COUNT(*) FROM orders WHERE user_id = u.id) as order_count
       FROM users u
       ORDER BY u.created_at DESC`
    )

    res.json({
      success: true,
      users: result.rows
    })
  } catch (error) {
    console.error('Get admin users error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    })
  }
}

//  Toggle user status (admin)
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params

    const result = await query(
      `UPDATE users 
       SET is_active = NOT is_active, 
           updated_at = NOW()
       WHERE id = $1 
       RETURNING *`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    if (result.rows[0].is_active === false) {
      await query(
        `DELETE FROM session
         WHERE sess::jsonb @> $1::jsonb`,
        [`{"user":{"id":${id}}}`]
      )
    }

    res.json({
      success: true,
      message: result.rows[0].is_active
        ? 'User has been activated'
        : 'User has been banned from the platform',
      user: result.rows[0]
    })
  } catch (error) {
    console.error('Toggle user status error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to toggle user status'
    })
  }
}

//  Delete user (admin)

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    //  Check if user exists
    const userCheck = await query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    )

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

   /* if(userCheck.role === "admin") {
      return res.status(401).json({
        success: false,
        message: 'Cannot delete Admin'
      })
    } */

    //  Delete user's session (if they're logged in)
    await query(
      `DELETE FROM session 
       WHERE sess::jsonb @> $1::jsonb`,
      [`{"user":{"id":${id}}}`]
    )

    //  Delete the user
    const result = await query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id]
    )

    res.json({
      success: true,
      message: 'User deleted successfully'
    })

  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    })
  }
}

//  Get single user (admin)
export const getAdminUserById = async (req, res) => {
  try {
    const { id } = req.params

    const result = await query(
      `SELECT u.*, 
        (SELECT COUNT(*) FROM orders WHERE user_id = u.id) as order_count
       FROM users u
       WHERE u.id = $1`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      user: result.rows[0]
    })
  } catch (error) {
    console.error('Get admin user by id error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    })
  }
}

export const updateAdminUser = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, phone_number, role, is_active } = req.body

    if (!name?.trim() || !email?.trim() || !['customer', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and a valid role are required'
      })
    }

    const result = await query(
      `UPDATE users
       SET name = $1, email = $2, phone_number = $3, role = $4, is_active = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [name.trim(), email.trim(), phone_number?.trim() || null, role, is_active !== false, id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (result.rows[0].is_active === false) {
      await query(
        `DELETE FROM session
         WHERE sess::jsonb @> $1::jsonb`,
        [`{"user":{"id":${id}}}`]
      )
    }

    res.json({ success: true, message: 'User updated successfully', user: result.rows[0] })
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'That email is already in use' })
    }
    console.error('Update admin user error:', error)
    res.status(500).json({ success: false, message: 'Failed to update user' })
  }
}