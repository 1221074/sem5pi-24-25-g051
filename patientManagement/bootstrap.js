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
const Allergy = require('./src/Models/Allergy');
const MedicalRecord = require('./src/Models/MedicalRecord');
const MedicalCondition = require('./src/Models/MedicalCondition');

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

const defaultMedicalConditions = [
  "A04.0 Cholera",
  "A08.0: Rotavirus enteritis",
  "B20: Human Immunodeficiency Virus (HIV) disease",
  "B50: Plasmodium falciparum malaria",
  "2A20.0: Malignant neoplasm of lung",
  "2F44.0: Malignant neoplasm of the breast",
  "3A01.1: Iron deficiency anemia",
  "4A44: Hereditary hemochromatosis",
  "5A11: Type 1 diabetes mellitus",
  "5B55: Obesity",
  "6A80: Major depressive disorder",
  "6C40: Generalized anxiety disorder",
  "FB20.1: Osteoporosis with pathological fracture",
  "FB81.1: Osteoarthritis of the knee",
  "FB81.2: Osteoarthritis of the hip",
  "FB80.1: Rheumatoid arthritis",
  "FA24.0: Fracture of femur",
  "FA22.0: Fracture of radius and ulna",
  "FA21.0: Dislocation of shoulder",
  "FB70.0: Low back pain"
];

const patient = {
  id: "3db99a54-5df4-4a21-b3ce-d593192d90ee",
  fullName: "1220612",
  email: "1220612@isep.ipp.pt",
};

// Insert Patients into the Database
const bootstrap = async () => {
  try {
    const allergyObjects = defaultAllergies.map(allergy => ({ name: allergy }));
    const medicalConditionObjects = defaultMedicalConditions.map(condition => ({ name: condition }));

    // Clear the database before inserting new data
    await Allergy.deleteMany();
    await MedicalCondition.deleteMany();
    await MedicalRecord.deleteMany();
    logSuccess('Previous data cleared.');

    // Insert first the default data that isn't dependent on other data 
    const insertedAllergies = await Allergy.insertMany(allergyObjects);
    logSuccess('Allergies inserted successfully.');

    const insertedMedicalConditions = await MedicalCondition.insertMany(medicalConditionObjects);
    logSuccess('Medical conditions inserted successfully.');

    const randomAllergies = insertedAllergies
      .sort(() => 0.5 - Math.random()) // Shuffle
      .slice(0, 3) // Pick 3 random allergies
      .map((allergy) => allergy._id);

    const randomMedicalConditions = insertedMedicalConditions
      .sort(() => 0.5 - Math.random()) // Shuffle
      .slice(0, 2) // Pick 2 random medical conditions
      .map((condition) => condition._id);

    const newMedicalRecord = new MedicalRecord({
      patientId: patient.id,
      allergies: randomAllergies,
      medicalConditions: randomMedicalConditions,
      freeText: ``,
    });

    await newMedicalRecord.save();
    logSuccess(`Medical record created successfully for patient: ${patient.fullName}`);

    logSuccess('Database bootstrapped successfully.');

    // Close the connection after bootstrapping
    mongoose.connection.close();
  } catch (err) {
    logError(`Error during bootstrap: ${err.message}`);
    mongoose.connection.close();
  }
};

bootstrap();
