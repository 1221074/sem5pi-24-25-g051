import { Repo } from "../../core/infra/Repo";
import { MedicalCondition } from "../../Domain/medicalcondition/medicalcondition";
import { MedicalConditionId } from "../../Domain/medicalcondition/medicalconditionId";

export default interface IMedicalConditionRepo extends Repo<MedicalCondition> {
  save(medicalcondition: MedicalCondition): Promise<MedicalCondition>;
  findByDomainId (medicalconditionId: MedicalConditionId | string): Promise<MedicalCondition>;

  getAllMedicalConditions(): Promise<MedicalCondition[]>;
    
  //findByIds (rolesIds: RoleId[]): Promise<Role[]>;
  //saveCollection (roles: Role[]): Promise<Role[]>;
  //removeByRoleIds (roles: RoleId[]): Promise<any>
}