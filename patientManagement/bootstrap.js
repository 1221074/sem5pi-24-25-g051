const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


  // Correct path to the Models in /src/models
const Patient = require('./src/Models/Patient');
const Allergy = require('./src/Models/Allergy');
const MedicalRecord = require('./src/Models/MedicalRecord');

// ANSI escape codes for colors
const COLORS = {
  RESET: '\x1b[0m',
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
};

// Function to log success in green
const logSuccess = (message) => {
  console.log(`${COLORS.GREEN}${message}${COLORS.RESET}`);
};

// Function to log error in red
const logError = (message) => {
  console.error(`${COLORS.RED}${message}${COLORS.RESET}`);
};


// Default Allergies List
const defaultAllergies = [
  "Peanut Allergy",
  "Shellfish Allergy (e.g., shrimp, lobster)",
  "Milk Allergy (Dairy products)",
  "Egg Allergy",
  "Tree Nut Allergy (e.g., almonds, walnuts)",
  "Wheat Allergy",
  "Penicillin Allergy",
  "Sulfa Drugs Allergy (e.g., sulfamethoxazole)",
  "Aspirin Allergy",
  "Local Anesthetics Allergy (e.g., Lidocaine)",
  "Pollen Allergy (e.g., grass, ragweed)",
  "Dust Mite Allergy",
  "Mold Allergy",
  "Cat Dander Allergy",
  "Dog Dander Allergy",
  "Latex Allergy",
  "Nickel Allergy (common in jewelry or metal objects)",
  "Bee Sting Allergy",
  "Fire Ant Sting Allergy",
  "Perfume Allergy (fragrance sensitivity)"
];

// Insert Patients into the Database
const bootstrap = async () => {
  try {
    const allergyObjects = defaultAllergies.map(allergy => ({ name: allergy }));

    // Clear the database before inserting new data
    await Allergy.deleteMany();
    await Patient.deleteMany();
    await MedicalRecord.deleteMany();
    logSuccess('Previous data cleared.');

    // Insert first the default data that isn't dependent on other data 
    const insertedAllergies = await Allergy.insertMany(allergyObjects);
    logSuccess('Allergies inserted successfully.');

    const patients = [];
//Create the patient and the respective empty medical record
  for (let i = 0; i < 5; i++) {
    const patient = new Patient({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      dateOfBirth: faker.date.birthdate({ min: 1940, max: 2010, mode: 'year' }),
      gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
      medicalRecordNumber: faker.string.uuid(),
      contactInfo: {
        email: faker.internet.email(),
        phone: faker.phone.number('##########'),
      },
      allergies: faker.helpers.arrayElements(
        insertedAllergies.map(allergy => allergy._id),
        faker.number.int({ min: 1, max: 5 })
      ),
      emergencyContact: {
        name: faker.person.fullName(),
        phone: faker.phone.number('##########'),
      },
      appointmentHistory: [
        {
          date: faker.date.soon(30),
          type: faker.helpers.arrayElement(['Checkup', 'Surgery', 'Consultation']),
          status: faker.helpers.arrayElement(['Scheduled', 'Completed', 'Cancelled']),
        },
      ],
    });

    await patient.save();

    // Step 4: Create an empty medical record for the new patient
    const medicalRecord = new MedicalRecord({
      patientId: patient._id, // Link to the Patient document
      allergies: [], // Initially empty
      chronicConditions: [],
      previousSurgeries: [],
      familyHistory: { father: '', mother: '' },
      smokingStatus: '',
      currentMedications: [],
      recentVisits: [],
      labResults: [],
      immunizations: [],
      planRecommendations: ''
    });

    await medicalRecord.save();
    patients.push(patient);
  }

  logSuccess('Patients and their medical records inserted successfully.');
  logSuccess('Database bootstrapped successfully.');

  // Close the connection after bootstrapping
  mongoose.connection.close();
  } catch (err) {
    logError(`Error during bootstrap: ${err.message}`);
    mongoose.connection.close();
  }
};

bootstrap();
