import { query } from "../../config/database.js";
import bcrypt from 'bcrypt';

export const getStoreSettings = async (req, res) => {
  try {
    const adminId = req.session.user.id
    const result = await query(
      "SELECT name, email, phone_number, address FROM users WHERE id = $1", 
      [adminId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      })
    }

  res.json({
    success: true,
       settings: {
        name: result.rows[0].name,
        email: result.rows[0].email,
        phone: result.rows[0].phone_number,  
        address: result.rows[0].address,
    }
  })

  } catch (error) {
    console.error('Get settings error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get store settings'
    })
  }
}

export const updateStoreSettings = async (req, res) => {
  try {
    const adminId = req.session.user.id;
    const { name, phone, address } = req.body;

   
    const result = await query(
      `UPDATE users 
       SET name = $1, 
           phone_number = $2, 
           address = $3, 
           updated_at = NOW() 
       WHERE id = $4 
       RETURNING id, name, email, phone_number, address`,
      [name, phone, address, adminId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      })
    }

    
    req.session.user.name = result.rows[0].name;

    res.json({
      success: true,
      message: 'Store settings updated successfully!',
      settings: result.rows[0]
    })

  } catch (error) {
    console.error("Failed to update store settings:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to update store settings'
    })
  }
}

export const changePasswordSettings = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const adminId = req.session.user.id;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All password fields are required'
      })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      })
    }

    const response = await query(
      "SELECT password FROM users WHERE id = $1", 
      [adminId]
    );

    if (response.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      })
    }

    const admin = response.rows[0];
    const checkPassword = await bcrypt.compare(currentPassword, admin.password);

    if (!checkPassword) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await query(
      "UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2",
      [hashedPassword, adminId]
    );

    return res.json({
      success: true,
      message: "Password changed successfully!"
    })

  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to change password"
    })
  }
}