import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import config from "../../../config";
import IMedicalRecordController from "../../controllers/IControllers/IMedicalRecordController";

const route = Router();

export default (app: Router) => {
  app.use('/medicalrecord', route);

  const ctrl = Container.get(config.controllers.medicaRecord.name) as IMedicalRecordController;
 route.post('',
    celebrate({
      body: Joi.object({
        patientId: Joi.string().required(),
        allergies: Joi.array().required(),
        medicalConditions: Joi.array().required(),
        freeText: Joi.string().optional()
      })
    }),
    (req, res, next) => ctrl.createMedicalRecord(req, res, next) );

  route.patch('/:id',
    celebrate({
      body: Joi.object({
        allergies: Joi.array().optional(),
        medicalConditions: Joi.array().optional(),
        freeText: Joi.string().optional()
      }),
      params: Joi.object({
        id: Joi.string().required()
    })
    }),
    (req, res, next) => ctrl.updateMedicalRecord(req, res, next) );

  route.get('', (req, res, next) => ctrl.getAllMedicalRecords(req, res, next) );
  route.get('/:id', (req, res, next) => ctrl.getMedicalRecord(req, res, next) );
};
