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


  const allergiesController = {
    name: config.controllers.allergy.name,
    path: config.controllers.allergy.path
  }

  const medicalConditionController = {
    name: config.controllers.medicalCondition.name,
    path: config.controllers.medicalCondition.path
    }

  const allergiesRepo = {
    name: config.repos.allergy.name,
    path: config.repos.allergy.path
  }

  const medicalConditionRepo = {
    name: config.repos.medicalCondition.name, 
    path: config.repos.medicalCondition.path
  }

  const allergiesService = {
    name: config.services.allergy.name,
    path: config.services.allergy.path
  }

  const medicalConditionService = {
    name: config.services.medicalCondition.name,
    path: config.services.medicalCondition.path
  }

  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [
      allergiesSchema,
      medicalConditionSchema
    ],
    controllers: [
      allergiesController,
      medicalConditionController
    ],
    repos: [
      allergiesRepo,
      medicalConditionRepo
      
    ],
    services: [
      allergiesService,
      medicalConditionService
    ]
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
