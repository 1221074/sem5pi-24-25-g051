import { Result } from "../../core/logic/Result";
import { IAllergyDTO } from "../../dto/IAllergyDTO";

export default interface IAllergyService  {
  createAllergy(allergiesDTO: IAllergyDTO): Promise<Result<IAllergyDTO>>;
  updateAllergy(id: string, allergiesDTO: Partial<IAllergyDTO>): Promise<Result<IAllergyDTO>>;

  getAllergy (allergiesId: string): Promise<Result<IAllergyDTO>>;
  getAllAllergies (): Promise<IAllergyDTO[]>;
}
