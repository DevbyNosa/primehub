import express from 'express';
import { query } from "../config/database.js";


export async function newsLetterController(req, res) {
  const {email} = req.body;
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    })
  }
  try {

  const existing = await query(
      'SELECT * FROM newsletter_subscribers WHERE email = $1',
      [email]
    )

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Already subscribed'
      })
    }

     await query(
      'INSERT INTO newsletter_subscribers (email) VALUES ($1)',
      [email]
    )

    res.json({
      success: true,
      message: 'Subscribed successfully!'
    })
  
  } catch(error) {
    console.error('Newsletter error:', error)
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    })
  }
}