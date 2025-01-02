import { Result } from "../../core/logic/Result";
import { IfreeTextDTO } from "../../dto/IFreeTextDTO";

export default interface IFreeTextService  {
  createFreeText(freeText: IfreeTextDTO): Promise<Result<IfreeTextDTO>>;
  updateFreeText(id: string, freeTextDTO: Partial<IfreeTextDTO>): Promise<Result<IfreeTextDTO>>;
  getFreeTextsFromMedicalRecord(medicalRecordID: string): Promise<IfreeTextDTO[]>;
  getAllFreeTexts(): Promise<IfreeTextDTO[]>;
}
