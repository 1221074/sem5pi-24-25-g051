import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

import config from '../../config';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  const allergiesSchema = {
    name: "allergySchema",
    schema: "../persistence/schemas/allergySchema"
  }

  const medicalConditionSchema = {
    name: "MedicalConditionSchema",
    schema: "../persistence/schemas/medicalconditionSchema"
  } 

  const medicalRecordSchema = {
    name: "MedicalRecordSchema",
    schema: "../persistence/schemas/medicalrecordSchema"
  }


  const allergiesController = {
    name: config.controllers.allergy.name,
    path: config.controllers.allergy.path
  }

  const medicalConditionController = {
    name: config.controllers.medicalCondition.name,
    path: config.controllers.medicalCondition.path
  }

  const medicalRecordController = {
    name: config.controllers.medicaRecord.name,
    path: config.controllers.medicaRecord.path
  }

  const allergiesRepo = {
    name: config.repos.allergy.name,
    path: config.repos.allergy.path
  }

  const medicalConditionRepo = {
    name: config.repos.medicalCondition.name, 
    path: config.repos.medicalCondition.path
  }

  const medicalRecordRepo = {
    name: config.repos.medicalRecord.name,
    path: config.repos.medicalRecord.path
  }

  const allergiesService = {
    name: config.services.allergy.name,
    path: config.services.allergy.path
  }

  const medicalConditionService = {
    name: config.services.medicalCondition.name,
    path: config.services.medicalCondition.path
  }

  const medicalRecordService = {
    name: config.services.medicalRecord.name,
    path: config.services.medicalRecord.path
  }

  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [
      allergiesSchema,
      medicalConditionSchema,
      medicalRecordSchema
    ],
    controllers: [
      allergiesController,
      medicalConditionController,
      medicalRecordController
    ],
    repos: [
      allergiesRepo,
      medicalConditionRepo,
      medicalRecordRepo
      
    ],
    services: [
      allergiesService,
      medicalConditionService,
      medicalRecordService
    ]
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
