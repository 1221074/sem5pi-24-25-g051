import { Request, Response, NextFunction } from 'express';

export default interface IAllergyController  {
  getAllergy(req: Request, res: Response, next: NextFunction);
  getAllAllergies(req: Request, res: Response, next: NextFunction);
  updateAllergy(req: Request, res: Response, next: NextFunction);
  createAllergy(req: Request, res: Response, next: NextFunction);
}
