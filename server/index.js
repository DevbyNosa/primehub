import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { pool } from './config/database.js';
import apiRoutes from './routes/api.js';
import authRoutes from './routes/auth.js';
import pageRoutes from './routes/pages.js';
import adminRoutes from './routes/admin.js';
import sessionConfig from './config/session.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { checkBanStatus } from './middleware/checkBanStatus.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.set('trust proxy', 1);


app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const allowedOrigins = [
    'http://localhost:5173',  
    'http://localhost:3000',  
    process.env.CLIENT_URL    
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
             console.log(' Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie']
}));

// Logging
app.use(morgan('dev'));

// Compression
app.use(compression());

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.set('trust proxy', 1);
app.use(sessionConfig);
//app.use(checkBanStatus)


// Routes
app.use("/", apiRoutes);
app.use("/api/auth", authRoutes);
app.use("/", pageRoutes);
app.use("/api/admin", adminRoutes);

// ============ ROUTES ============

app.get('/api/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'API is working!',
        timestamp: new Date()
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date(),
        uptime: process.uptime()
    });
});

app.get('/api/404', (req, res) => {
    res.status(404).json({
        success: false,
        message: "The Page you're looking for doesn't exist"
    });
});

if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientPath));
  
  // Handle React Router routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

app.use('/*splat', (req, res) => {  
    res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ============ START SERVER ============

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});