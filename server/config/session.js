import session from 'express-session'
import pgSession from 'connect-pg-simple'
import { pool } from './database.js'
import 'dotenv/config'

const PgSession = pgSession(session)
const isProduction = process.env.NODE_ENV === 'production'

const sessionConfig = session({
  store: new PgSession({
    pool: pool,
    tableName: 'session',
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    domain: isProduction ? '.onrender.com' : undefined,
  },
})

export default sessionConfig