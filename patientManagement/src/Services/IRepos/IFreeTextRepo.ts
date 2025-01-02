import { Repo } from "../../core/infra/Repo";
import { FreeTextID } from "../../Domain/freeTextEntry/FreeTextID";
import { FreeText } from "../../Domain/freeTextEntry/FreeText";

export default interface IFreeTextRepo extends Repo<FreeText> {
  save(freeText: FreeText): Promise<FreeText>;
  findByDomainId (freeText: FreeTextID | string): Promise<FreeText>;
  findByMedicalRecordID (medicalRecordID: string): Promise<FreeText[]>;

  getAllFreeTexts(): Promise<FreeText[]>;
    
  //findByIds (rolesIds: RoleId[]): Promise<Role[]>;
  //saveCollection (roles: Role[]): Promise<Role[]>;
  //removeByRoleIds (roles: RoleId[]): Promise<any>
}