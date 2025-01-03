import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import { Result } from "../core/logic/Result";
import config from "../../config";
import IMedicalConditionService from '../Services/IServices/IMedicalConditionService';
import  { IMedicalConditionDTO } from '../dto/IMedicalConditionDTO';
import IMedicalConditionController from "./IControllers/IMedicalConditionController";

@Service()
export default class MedicalConditionController implements IMedicalConditionController {
  constructor(
      @Inject(config.services.medicalCondition.name) private medicalConditionServiceInstance : IMedicalConditionService
  ) {}

  public async createMedicalCondition(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalConditionOrError = await this.medicalConditionServiceInstance.createMedicalCondition(req.body as IMedicalConditionDTO) as Result<IMedicalConditionDTO>;

      if (medicalConditionOrError.isFailure) {
        return res.status(400).json({ message: medicalConditionOrError.errorValue() });
      }

      const medicalConditionDTO = medicalConditionOrError.getValue();
      return res.status(201).json( medicalConditionDTO );
    }
    catch (e) {
      return next(e);
    }
  };

  public async updateMedicalCondition(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalConditionOrError = await this.medicalConditionServiceInstance.updateMedicalCondition(req.params.id, req.body as Partial<IMedicalConditionDTO>) as Result<IMedicalConditionDTO>;

      if (medicalConditionOrError.isFailure) {
        return res.status(404).json({ message: medicalConditionOrError.errorValue() });
      }

      const medicalConditionDTO = medicalConditionOrError.getValue();
      return res.status(201).json( medicalConditionDTO );
    }
    catch (e) {
      return next(e);
    }
  };

  public async getMedicalCondition(req: Request, res: Response, next: NextFunction) {
    try {
      const domainId = req.params.id;
      const medicalCondition = await this.medicalConditionServiceInstance.getMedicalCondition(domainId);

      if (medicalCondition.isFailure) {
        return res.status(500).json('Medical Condition not found: ' + medicalCondition.error);
      }

      return res.status(200).json(medicalCondition.getValue());
    } catch (e) {
      return res.status(500).json(e.message);
    }

  }

  public async getAllMedicalConditions(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalConditions = await this.medicalConditionServiceInstance.getAllMedicalConditions();
      return res.status(200).json(medicalConditions);
    } catch (e) {
      return next(e);
    }
  };
}
