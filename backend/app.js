const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');

dotenv.config();
connectDB();

const app = express();

// ✅ Updated CORS to allow both localhost and Vercel domain
const allowedOrigins = [
  'http://localhost:4200',
  'https://task-manager-fullstock.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;
