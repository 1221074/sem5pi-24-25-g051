import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import IAllergyService from '../Services/IServices/IAllergyService';
import { IAllergyDTO } from '../dto/IAllergyDTO';
import { Result } from '../core/logic/Result';
import IAllergyController from './IControllers/IAllergyController';
import config from "../../config";

@Service()
export default class AllergyController implements IAllergyController {
  constructor(
    @Inject(config.services.allergy.name) private allergyServiceInstance: IAllergyService
  ) {}

  public async createAllergy(req: Request, res: Response, next: NextFunction) {
    try {
      const allergyOrError = await this.allergyServiceInstance.createAllergy(req.body as IAllergyDTO) as Result<IAllergyDTO>;

      if (allergyOrError.isFailure) {
        return res.status(400).send(allergyOrError.error);
      }

      const allergyDTO = allergyOrError.getValue();
      return res.status(201).json(allergyDTO);
    } catch (e) {
      return next(e);
    }
  }

  public async updateAllergy(req: Request, res: Response, next: NextFunction) {
    try {
      const allergyOrError = await this.allergyServiceInstance.updateAllergy(req.params.id, req.body as Partial<IAllergyDTO>) as Result<IAllergyDTO> ;

      if (allergyOrError.isFailure) {
        return res.status(404).send(allergyOrError.error);
      }

      const allergyDTO = allergyOrError.getValue();
      return res.status(200).json(allergyDTO);
    } catch (e) {
      return next(e);
    }
  }

  public async getAllergy(req: Request, res: Response, next: NextFunction) {
    try {
      const allergyOrError = await this.allergyServiceInstance.getAllergy(req.params.id);

      if (allergyOrError.isFailure) {
        return res.status(404).send(allergyOrError.error);
      }

      return res.status(200).json(allergyOrError.getValue());
    } catch (e) {
      return next(e);
    }
  }
  
  public async getAllAllergies(req: Request, res: Response, next: NextFunction) {
    try {
      const allergies = await this.allergyServiceInstance.getAllAllergies();
      return res.json(allergies).status(200);
    } catch (e) {
      return next(e);
    }
  };
}
