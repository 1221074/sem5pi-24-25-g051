import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IAllergyPersistence } from '../DataSchema/IAllergyPersistence';
import { IAllergyDTO } from "../dto/IAllergyDTO";
import { Allergy } from "../Domain/allergy/allergy";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Description } from "../Domain/shared/description";

export class AllergyMap extends Mapper<Allergy> {

  public static toDTO(allergy: Allergy): IAllergyDTO {
    return {
      id: allergy.id.toString(),
      name: allergy.name,
      description: allergy.description,
    } as IAllergyDTO;
  }

  public static toDomain (allergies: any | Model<IAllergyPersistence & Document> ): Allergy {
    const allergyOrError = Allergy.create(allergies, new UniqueEntityID(allergies.domainId));

    allergyOrError.isFailure ? console.log(allergyOrError.error) : '';

    return allergyOrError.isSuccess ? allergyOrError.getValue() : null;
  }

  public static toPersistence(allergy: Allergy): any {
    return {
      domainId: allergy.id.toString(),
      name: allergy.name,
      description: allergy.description,
    };
  }
}
