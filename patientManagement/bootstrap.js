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

// Generate 5 Fake Patients
const defaultpatients = Array.from({ length: 5 }, () => ({
  firstName: faker.person.firstName(), // Updated from faker.name.firstName
  lastName: faker.person.lastName(), // Updated from faker.name.lastName
  dateOfBirth: faker.date.birthdate({ min: 1940, max: 2010, mode: 'year' }),
  gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
  medicalRecordNumber: faker.string.uuid(), // Updated from faker.datatype.uuid
  contactInfo: {
    email: faker.internet.email(),
    phone: faker.phone.number('##########'),
  },
  allergies: faker.helpers.arrayElements(defaultAllergies, faker.number.int({ min: 1, max: 5 })), // Updated to faker.number.int
  medicalConditions: faker.helpers.arrayElements([
    "Hypertension",
    "Diabetes",
    "Asthma",
    "Arthritis",
    "Chronic Pain",
    "Heart Disease"
  ], faker.number.int({ min: 1, max: 3 })), // Updated to faker.number.int
  emergencyContact: {
    name: faker.person.fullName(), // Updated from faker.name.findName
    phone: faker.phone.number('##########'),
  },
  appointmentHistory: [
    {
      date: faker.date.soon(30),
      type: faker.helpers.arrayElement(['Checkup', 'Surgery', 'Consultation']),
      status: faker.helpers.arrayElement(['Scheduled', 'Completed', 'Cancelled']),
    }
  ],
}));

// Insert Patients into the Database
const bootstrap = async () => {
  try {
    const allergyObjects = defaultAllergies.map(allergy => ({ name: allergy }));

    await Patient.deleteMany(); // Clear existing data

    await Patient.insertMany(defaultpatients);
    await Allergy.insertMany(allergyObjects);
    console.log('Database bootstrapped with fake data:');
    console.log(defaultpatients);
    console.log(defaultAllergies);
    mongoose.connection.close();
  } catch (err) {
    console.error('Error during bootstrap:', err);
    mongoose.connection.close();
  }
};

bootstrap();
