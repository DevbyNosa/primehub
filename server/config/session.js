import session from 'express-session'
import pgSession from 'connect-pg-simple'
import { pool } from './database.js'
import 'dotenv/config'

const PgSession = pgSession(session)

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
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  },
})

export default sessionConfig