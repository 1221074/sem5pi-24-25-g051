const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
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

