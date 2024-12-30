import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import config from "../../../config";
import IMedicalConditionController from "../../controllers/IControllers/IMedicalConditionController";

const route = Router();

export default (app: Router) => {
  app.use('/medicalcondition', route);

  const ctrl = Container.get(config.controllers.medicalCondition.name) as IMedicalConditionController;

 route.post('',
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required()
      })
    }),
    (req, res, next) => ctrl.createMedicalCondition(req, res, next) );

  route.patch('/:id',
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required()
      }),
      params: Joi.object({
        id: Joi.string().required()
    })
    }),
    (req, res, next) => ctrl.updateMedicalCondition(req, res, next) );

  route.get('', (req, res, next) => ctrl.getAllMedicalConditions(req, res, next) );
  route.get('/:id', (req, res, next) => ctrl.getMedicalCondition(req, res, next) );
};
