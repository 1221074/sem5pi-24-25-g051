import { Mapper } from "../core/infra/Mapper";
import { Document, Model } from 'mongoose';
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { IMedicalConditionPersistence } from '../DataSchema/IMedicalConditionPersistence';
import { IMedicalConditionDTO } from "../dto/IMedicalConditionDTO";
import {MedicalCondition} from "../Domain/medicalcondition/medicalcondition";

export class MedicalConditionMap extends Mapper<MedicalCondition> {
  
  public static toDTO(medicalCondition: MedicalCondition): IMedicalConditionDTO {
    return {
      id: medicalCondition.id.toString(),
      name: medicalCondition.name,
      description: medicalCondition.description,
    } as IMedicalConditionDTO;
  }


  public static toDomain (medicalCondition: any | Model<IMedicalConditionPersistence & Document> ): MedicalCondition {
    const medicalConditionOrError = MedicalCondition.create(medicalCondition, new UniqueEntityID(medicalCondition.domainId));

    medicalConditionOrError.isFailure ? console.log(medicalConditionOrError.error) : '';

    return medicalConditionOrError.isSuccess ? medicalConditionOrError.getValue() : null;
  }

  public static toPersistence (medicalCondition: MedicalCondition): any {
    return {
        domainId: medicalCondition.id.toString(),
        name: medicalCondition.name,
        description: medicalCondition.description,
    };
  }
}