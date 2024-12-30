import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import IAllergyController from '../../controllers/IControllers/IAllergyController'; 
import config from "../../../config";

const route = Router();

export default (app: Router) => {
  app.use('/allergy', route);

  const ctrl = Container.get(config.controllers.allergy.name) as IAllergyController;

  route.post('',
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required()
      })
    }),
    (req, res, next) => ctrl.createAllergy(req, res, next) );

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
    (req, res, next) => ctrl.updateAllergy(req, res, next) );

    route.get('', (req, res, next) => ctrl.getAllAllergies(req, res, next) );
    route.get('/:id', (req, res, next) => ctrl.getAllergy(req, res, next));
};
