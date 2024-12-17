const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


// CORS Configuration
const corsOptions = {
    origin: 'http://localhost:4000', // Allow requests only from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed request methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow cookies if needed
  };



// Middleware
app.use(cors(corsOptions));
app.use(express.json());


console.log('MONGO_URI:', process.env.MONGO_URI);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Failed:', err));

// Routes
app.get('/', (req, res) => {
    res.send('Backend API is working!');
});

const patientRoutes = require('./src/Routes/patients');
const allergyRoutes = require('./src/Routes/allergies');
const medicalRecordRoutes = require('./src/Routes/medicalrecords');

app.use('/api', allergyRoutes);
app.use('/api', patientRoutes);
app.use('/api', medicalRecordRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

