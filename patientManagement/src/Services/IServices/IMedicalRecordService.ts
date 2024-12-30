import { Result } from "../../core/logic/Result";
import { IMedicalRecordDTO } from "../../dto/IMedicalRecordDTO";

export default interface IMedicalRecordService  {
  createMedicalRecord(medicalrecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO>>;
  updateMedicalRecord(id: string, medicalrecordDTO: Partial<IMedicalRecordDTO>): Promise<Result<IMedicalRecordDTO>>;
  getMedicalRecord(medicalrecordId: string): Promise<Result<IMedicalRecordDTO>>;
  getAllMedicalRecords(): Promise<IMedicalRecordDTO[]>;
}
