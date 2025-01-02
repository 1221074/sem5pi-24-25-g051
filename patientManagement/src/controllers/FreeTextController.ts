import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import { Result } from "../core/logic/Result";
import config from "../../config";
import IFreeTextService from '../Services/IServices/IFreeTextService';
import { IfreeTextDTO } from '../dto/IFreeTextDTO';
import IFreeTextController from './IControllers/IFreeTextController';

@Service()
export default class FreeTextController implements IFreeTextController {
  constructor(
    @Inject(config.services.freeText.name) private freeTextServiceInstance: IFreeTextService
  ) { }


  public async createFreeText(req: Request, res: Response, next: NextFunction) {
    try {
      const FreeTextOrError = await this.freeTextServiceInstance.createFreeText(req.body as IfreeTextDTO) as Result<IfreeTextDTO>;

      if (FreeTextOrError.isFailure) {
        return res.status(409).json({ message: FreeTextOrError.errorValue() });
      }

      const freeTextDTO = FreeTextOrError.getValue();
      return res.json(freeTextDTO).status(201);
    }
    catch (e) {
      return next(e);
    }
  };

  public async updateFreeText(req: Request, res: Response, next: NextFunction) {
    try {
      const FreeTextOrError = await this.freeTextServiceInstance.updateFreeText(req.params.id, req.body as Partial<IfreeTextDTO>) as Result<IfreeTextDTO>;

      if (FreeTextOrError.isFailure) {
        return res.status(404).json({ message: FreeTextOrError.errorValue() });
      }

      const freeTextDTO = FreeTextOrError.getValue();
      return res.status(201).json(freeTextDTO);
    }
    catch (e) {
      return next(e);
    }
  };



  public async getFreeTextsFromMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalRecordID = req.params.id;
      const freeTexts = await this.freeTextServiceInstance.getFreeTextsFromMedicalRecord(medicalRecordID);
      
      if (!freeTexts) {
        res.status(404).json({ message: 'Free Texts not found' });
        return;
      }

      res.status(200).json(freeTexts);
    } catch (error: any) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };

  public async getAllFreeTexts(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('getAllFreeTexts');
      const freeTexts = await this.freeTextServiceInstance.getAllFreeTexts();
      res.status(200).json(freeTexts);
    } catch (e) {
      return next(e);
  }
}
}
