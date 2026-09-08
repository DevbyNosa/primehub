import { query } from '../../config/database.js'

export const getAdminMessages = async (req, res) => {
  try {
    const result = await query(`
      SELECT id, name, email, subject, message, is_read, created_at
      FROM contact
      ORDER BY created_at DESC
    `)

    res.json({ success: true, messages: result.rows })
  } catch (error) {
    console.error('Admin messages error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch messages' })
  }
}

export const markAdminMessageAsRead = async (req, res) => {
  try {
    const result = await query(
      'UPDATE contact SET is_read = true WHERE id = $1 RETURNING id, is_read',
      [req.params.id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Message not found' })
    }

    res.json({ success: true, message: result.rows[0] })
  } catch (error) {
    console.error('Mark admin message read error:', error)
    res.status(500).json({ success: false, message: 'Failed to update message' })
  }
}