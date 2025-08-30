const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/canteenDB';

// Middleware
app.use(cors());
app.use(express.json());




// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic test route
app.get('/', (req, res) => {
  res.send('Canteen backend running');
});


const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

