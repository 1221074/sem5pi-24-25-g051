import { Repo } from "../../core/infra/Repo";
import { Allergy } from "../../Domain/allergy/allergy";
import { AllergyId } from "../../Domain/allergy/allergyId";

export default interface IAllergiesRepo extends Repo<Allergy> {
  save(allergy: Allergy): Promise<Allergy>;
  findByDomainId (allergyId: AllergyId | string): Promise<Allergy>;

  getAllAllergies(): Promise<Allergy[]>;
    
  //findByIds (rolesIds: RoleId[]): Promise<Role[]>;
  //saveCollection (roles: Role[]): Promise<Role[]>;
  //removeByRoleIds (roles: RoleId[]): Promise<any>
}