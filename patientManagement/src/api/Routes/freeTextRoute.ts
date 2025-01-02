import { Router } from 'express';
import { celebrate, Joi, errors } from 'celebrate';
import { Container } from 'typedi';
import config from "../../../config";
import IFreeTextController from "../../controllers/IControllers/IFreeTextController";

const route = Router();

export default (app: Router) => {
  app.use('/freetext', route);

  const ctrl = Container.get(config.controllers.freeText.name) as IFreeTextController;

  route.post('',
    celebrate({
      body: Joi.object({
        freeText: Joi.string().required(),
        medicalRecordID: Joi.string().required()
      })
    }),
    (req, res, next) => ctrl.createFreeText(req, res, next)
  );

  route.patch('/:id',
    celebrate({
      body: Joi.object({
        freeText: Joi.string().required(),
        medicalRecordID: Joi.string().required()
      })
    }),
    (req, res, next) => ctrl.updateFreeText(req, res, next)
  );

  route.get('/:id', (req, res, next) => ctrl.getFreeTextsFromMedicalRecord(req, res, next) );

  // Error handling middleware
  app.use(errors());
};