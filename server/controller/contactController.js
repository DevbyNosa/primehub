import express from 'express';
import { query } from '../config/database.js';


export async function contactController(req, res) {
  try {
   const {name, email, subject, message} = req.body;

   if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "All field are required"
    })
   }

   await query(`INSERT INTO contact(name, email, subject, message) VALUES($1, $2, $3, $4)`, [name, email, subject, message]);


   res.json({
    success: true,
    message: "your message has been sent!"
   })

  } catch (error) {

  }
}