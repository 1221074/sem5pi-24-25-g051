const mongoose = require('mongoose');
const Allergy = require('./src/Models/Allergy');
const Patient = require('./src/Models/Patient');
const MedicalRecord = require('./src/Models/MedicalRecord');
require('dotenv').config();

async function cleanDatabase() {
    try {
        mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
          .then(() => console.log('MongoDB connected'))
          .catch(err => console.error('MongoDB connection error:', err));
        

        console.log('MongoDB connected');

        // Delete all documents in the Allergy collection
        await Allergy.deleteMany();
        await Patient.deleteMany();
        await MedicalRecord.deleteMany();
    } catch (error) {
        console.error('Error during database cleaning:', error);
    } finally {
        mongoose.disconnect();
        console.log('Database connection closed.');
    }
}

cleanDatabase();
