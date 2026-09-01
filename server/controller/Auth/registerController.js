import express from 'express';
import { query } from '../../config/database.js';
import sessionConfig from '../../config/session.js';
import bcrypt from 'bcrypt'

const saltRounds = 10;



export async function RegisterAccount(req, res) {
  try {
    const {name, email, number, password} = req.body;

    if(!name || !email || !number || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields"
      })
    }
    const selectTable = await query(`SELECT * FROM users WHERE email = $1`, [email]);

    if(selectTable.rows.length >= 1) {
      return res.status(400).json({
        success: false,
        message: "This email already exist."
      });
    }
     
    const hashedPassword = await bcrypt.hash(password, saltRounds);

     const resultTable = await query(`
      INSERT INTO users (name, email, phone_number, password, role) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `, [name, email, number, hashedPassword, 'customer']);


    const newUser = resultTable.rows[0];

    req.session.user = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone_number,
      role: newUser.role,
    };

     return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { 
        id: newUser.id, 
        email: newUser.email, 
        name: newUser.name, 
        number: newUser.phone_number,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error("Registration operational error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred"
    });
  }
}  