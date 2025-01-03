import dotenv from 'dotenv';
import path from 'path';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port : optional change to 4000 by JRT
   */
  port: parseInt(process.env.PORT, 10) || 3000,

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI || "mongodb://mongoadmin:83498eac5b74c5f83a630b6a@vs429.dei.isep.ipp.pt:27017/admin",

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || "my sakdfho2390asjod$%jl)!sdjas0i secret",

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  controllers: {

    allergy: {
      name: "AllergyController",
      path: "../controllers/allergyController"
    },
    medicalCondition: {
      name: "MedicalConditionController",
      path: "../controllers/medicalConditionController"
    },

    medicaRecord: {
      name: "MedicalRecordController",
      path: "../controllers/medicalRecordController"
    },

    freeText: {
      name: "FreeTextController",
      path: "../controllers/FreeTextController"
    },
  },

  repos: {

    allergy: {
      name: "AllergyRepo",
      path: "../Repo/allergyRepository"
    },
    medicalCondition: {
      name: "MedicalConditionRepo",
      path: "../Repo/medicalconditionRepository"
    },

    medicalRecord: {
      name: "MedicalRecordRepo",
      path: "../Repo/medicalrecordRepository"
    },

    freeText: {
      name: "FreeTextRepo",
      path: "../Repo/freeTextRepository"
    },

  },

  services: {

    allergy: {
      name: "AllergyService",
      path: "../Services/allergyService"
    },
    medicalCondition: {
      name: "MedicalConditionService",
      path: "../Services/medicalconditionService"
    },

    medicalRecord: {
      name: "MedicalRecordService",
      path: "../Services/medicalrecordService"
    },

    freeText: {
      name: "FreeTextService",
      path: "../Services/freeTextService"
    },
  },
};
