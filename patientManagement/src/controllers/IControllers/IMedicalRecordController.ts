import { Request, Response, NextFunction } from 'express';

export default interface IMedicalRecordController  {
  getMedicalRecord(req: Request, res: Response, next: NextFunction);
  getAllMedicalRecords(req: Request, res: Response, next: NextFunction);
  updateMedicalRecord(req: Request, res: Response, next: NextFunction);
  createMedicalRecord(req: Request, res: Response, next: NextFunction);
  sendEncryptedData(req: Request, res: Response, next: NextFunction);
}
