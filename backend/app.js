const express = require('express');
const cors = require('cors'); // ✅ Import cors
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');

dotenv.config();
connectDB();

const app = express();

// ✅ Enable CORS
app.use(cors({
  origin: 'http://localhost:4200', // allow requests from your frontend
  credentials: true // optional if using cookies or auth headers
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;
