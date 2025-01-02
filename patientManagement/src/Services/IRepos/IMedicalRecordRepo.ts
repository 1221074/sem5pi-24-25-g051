import { Repo } from "../../core/infra/Repo";
import { MedicalRecordId } from "../../Domain/medicalrecord/medicalrecordId";
import { MedicalRecord } from "../../Domain/medicalrecord/medicalrecord";

export default interface IMedicalRecordRepo extends Repo<MedicalRecord> {
  save(medicalRecord: MedicalRecord): Promise<MedicalRecord>;
  findByDomainId (medicalRecordID: MedicalRecordId | string): Promise<MedicalRecord>;
  findByPatientId (patientId: string): Promise<MedicalRecord>;

  getAllMedicalRecords(): Promise<MedicalRecord[]>;
    
  //findByIds (rolesIds: RoleId[]): Promise<Role[]>;
  //saveCollection (roles: Role[]): Promise<Role[]>;
  //removeByRoleIds (roles: RoleId[]): Promise<any>
}