import { Request, Response, NextFunction } from 'express';

export default interface IMedicalConditionController  {
  getMedicalCondition(req: Request, res: Response, next: NextFunction);
  getAllMedicalConditions(req: Request, res: Response, next: NextFunction);
  updateMedicalCondition(req: Request, res: Response, next: NextFunction);
  createMedicalCondition(req: Request, res: Response, next: NextFunction);
}
