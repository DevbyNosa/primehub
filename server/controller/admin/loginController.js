import bcrypt from 'bcrypt';
import { query } from '../../config/database.js';



export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    const result = await query(
      'SELECT * FROM users WHERE email = $1 AND ROLE = $2',
      [email, "admin"]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = result.rows[0];

  
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Set session
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    };

    req.session.save((saveError) => {
      if (saveError) {
        console.error('Admin session save error:', saveError);
        return res.status(500).json({
          success: false,
          message: 'Could not start admin session'
        });
      }

      res.json({
        success: true,
        message: 'Welcome Admin!',
        user: req.session.user
      });
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'An internal server error occurred'
    });
  }
};