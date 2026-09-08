export async function LoginAccount(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields"
      });
    }

    const tableSelect = await query(`SELECT * FROM users WHERE email = $1`, [email]);

    if (tableSelect.rows.length < 1) {
      return res.status(400).json({
        success: false,
        message: "Incorrect credential detail"
      });
    }

    const loginUser = tableSelect.rows[0];

    const isBanned = loginUser.is_active === false ||
      loginUser.is_active === 0 ||
      loginUser.is_active === 'false' ||
      loginUser.is_active === '0';

    if (loginUser.role === 'customer' && isBanned) {
      req.session.destroy(() => {});
      return res.status(403).json({
        success: false,
        code: 'USER_BANNED',
        message: 'Sorry, you have been banned from this platform.'
      });
    }

    const dbPassword = loginUser.password;
    const checkPassword = await bcrypt.compare(password, dbPassword);
    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        message: "Incorrect credential detail"
      });
    }

    
    req.session.user = {
      id: loginUser.id,
      email: loginUser.email,
      name: loginUser.name,
      phone: loginUser.phone_number,
      role: loginUser.role,
    };

    
    req.session.save((saveError) => {
      if (saveError) {
        console.error('Session save error:', saveError);
        return res.status(500).json({
          success: false,
          message: 'Could not start session'
        });
      }

      return res.status(200).json({
        success: true,
        message: "Logged in successfully",
        user: req.session.user
      });
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred"
    });
  }
}