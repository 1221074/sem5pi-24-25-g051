import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import { Result } from "../core/logic/Result";
import config from "../../config";
import IMedicalRecordService from '../Services/IServices/IMedicalRecordService';
import  { IMedicalRecordDTO } from '../dto/IMedicalRecordDTO';
import IMedicalRecordController from './IControllers/IMedicalRecordController';

@Service()
export default class MedicalRecordController implements IMedicalRecordController {
  constructor(
      @Inject(config.services.medicalRecord.name) private medicalRecordServiceInstance : IMedicalRecordService
  ) {}

  public async createMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalRecordOrError = await this.medicalRecordServiceInstance.createMedicalRecord(req.body as IMedicalRecordDTO) as Result<IMedicalRecordDTO>;

      if (medicalRecordOrError.isFailure) {
        return res.status(409).json({ message: medicalRecordOrError.errorValue() });
      }

      const medicalRecordDTO = medicalRecordOrError.getValue();
      return res.json( medicalRecordDTO ).status(201);
    }
    catch (e) {
      return next(e);
    }
  };

  public async updateMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalRecordOrError = await this.medicalRecordServiceInstance.updateMedicalRecord(req.params.id, req.body as Partial<IMedicalRecordDTO>) as Result<IMedicalRecordDTO>;

      if (medicalRecordOrError.isFailure) {
        return res.status(404).json({ message: medicalRecordOrError.errorValue() });
      }

      const medicalRecordDTO = medicalRecordOrError.getValue();
      return res.status(201).json( medicalRecordDTO );
    }
    catch (e) {
      return next(e);
    }
  };

  public async getMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const domainId = req.params.id;
      const medicalRecord = await this.medicalRecordServiceInstance.getMedicalRecord(domainId);

      if (medicalRecord.isFailure) {
        return res.status(500).json('Medical Record not found: ' + medicalRecord.error);
      }

      return res.json(medicalRecord.getValue()).status(200);
    } catch (e) {
      return res.status(500).json(e.message);
    }

  }

  public async getAllMedicalRecords(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('getAllMedicalRecords');
      const medicalRecords = await this.medicalRecordServiceInstance.getAllMedicalRecords();
      return res.json(medicalRecords).status(200);
    } catch (e) {
      return next(e);
    }
  };
}
