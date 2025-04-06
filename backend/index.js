const express = require("express");
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const vendorRoutes = require('./routes/vendorRoutes');
const bodyParser = require('body-parser');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const path = require('path')

const app = express()

const PORT = process.env.PORT || 4000;

dotEnv.config();
// Configure CORS to explicitly allow requests from your frontend and admin apps
const allowedOrigins = [
  // Local development URLs
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175', 
  'http://localhost:5176',
  'http://localhost:5177',
  // Production URLs
  'https://foody-mern.vercel.app',
  'https://foody-admin0.vercel.app',
  // Allow any Vercel domain for development/staging environments
  'https://*.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests, or same-origin)
    if (!origin) return callback(null, true);
    
    // Check if the origin is allowed
    if (
      allowedOrigins.includes(origin) || 
      origin.endsWith('.vercel.app') ||
      origin.includes('vercel.app')
    ) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully!"))
    .catch((error) => console.log(error))

app.use(bodyParser.json());

// Health check endpoint
app.get('/status', (req, res) => {
    res.json({
        status: 'ok',
        time: new Date().toISOString(),
        mongoConnection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// API routes - make them available both with and without /api prefix
app.use('/api/vendor', vendorRoutes);
app.use('/vendor', vendorRoutes);

app.use('/api/firm', firmRoutes);
app.use('/firm', firmRoutes);

app.use('/api/product', productRoutes);
app.use('/product', productRoutes);

app.use('/api/user', userRoutes);
app.use('/user', userRoutes);

app.use('/uploads', express.static('uploads'));

// Default route
app.get('/', (req, res) => {
    res.send("<h1>Welcome to Foody API</h1>");
});

app.listen(PORT, () => {
    console.log(`server started and running at ${PORT}`);
});