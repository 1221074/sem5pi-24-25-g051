import { Result } from "../../core/logic/Result";
import { IMedicalConditionDTO } from "../../dto/IMedicalConditionDTO";

export default interface IMedicalConditionService  {
  createMedicalCondition(medicalconditionDTO: IMedicalConditionDTO): Promise<Result<IMedicalConditionDTO>>;
  updateMedicalCondition(id: string, medicalconditionDTO: Partial<IMedicalConditionDTO>): Promise<Result<IMedicalConditionDTO>>;

  getMedicalCondition (medicalconditionId: string): Promise<Result<IMedicalConditionDTO>>;
  getAllMedicalConditions (): Promise<IMedicalConditionDTO[]>;
}
