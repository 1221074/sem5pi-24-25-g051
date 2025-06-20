import { Request, Response, NextFunction } from 'express';

export default interface IFreeTextController  {
  getFreeTextsFromMedicalRecord(req: Request, res: Response, next: NextFunction);
  updateFreeText(req: Request, res: Response, next: NextFunction);
  createFreeText(req: Request, res: Response, next: NextFunction);
  getAllFreeTexts(req: Request, res: Response, next: NextFunction);
  getFreeText(req: Request, res: Response, next: NextFunction);
}
