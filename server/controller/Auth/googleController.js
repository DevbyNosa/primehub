import axios from "axios";
import { query } from "../../config/database.js";
import 'dotenv/config';

export async function GoogleRoutes (req, res) {
    const url = 'https://accounts.google.com/o/oauth2/v2/auth?' +
            'client_id=' + process.env.GOOGLE_CLIENT_ID +
            '&redirect_uri=' + process.env.GOOGLE_REDIRECT_URI +
            '&response_type=code' +
            '&scope=profile email' +
            '&access_type=offline' +
            '&prompt=consent';
        res.redirect(url);
}


export async function GoogleAuthRegistration(req, res) {
   const { code } = req.query;
    if (!code) {
        return res.redirect('/login?error=no_code');
    }
    try {
        const tokenRes = await axios.post(
            'https://oauth2.googleapis.com/token',
            new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                code: code,
                grant_type: 'authorization_code',
            })
        );
        const { access_token } = tokenRes.data;
        const userRes = await axios.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            { headers: { Authorization: `Bearer ${access_token}` } }
        );
        const { id: googleId, email, name, picture } = userRes.data;
        
        let user = await query('SELECT * FROM users WHERE google_id = $1', [googleId]);
        if (user.rows.length === 0) {
            const existing = await query('SELECT * FROM users WHERE email = $1', [email]);
            if (existing.rows.length > 0) {
                await query(
                    'UPDATE users SET google_id = $1, avatar = $2 WHERE id = $3',
                    [googleId, picture, existing.rows[0].id]
                );
                user = await query('SELECT * FROM users WHERE id = $1', [existing.rows[0].id]);
            } else {
                user = await query(
                    `INSERT INTO users (name, email, google_id, avatar, role)
                     VALUES ($1, $2, $3, $4, 'customer')
                     RETURNING *`,
                    [name, email, googleId, picture]
                );
            }
        }
        
        req.session.user = {
            id: user.rows[0].id,
            name: user.rows[0].name,
            email: user.rows[0].email,
            role: user.rows[0].role,
            avatar: user.rows[0].avatar,
        };
        
        res.redirect('http://localhost:5173/dashboard');
    } catch (error) {
        console.error('Google OAuth Error:', error.response?.data || error.message);
        res.redirect('/login?error=auth_failed');
    }
}