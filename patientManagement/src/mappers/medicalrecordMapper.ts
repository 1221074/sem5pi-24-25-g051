import { Mapper } from "../core/infra/Mapper";
import { Document, Model } from 'mongoose';
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { IMedicalRecordPersistence } from '../DataSchema/IMedicalRecordPersistence';
import { IMedicalRecordDTO } from "../dto/IMedicalRecordDTO";
import {MedicalRecord} from "../Domain/medicalrecord/medicalrecord";
import { identity } from "lodash";

export class MedicalRecordMap extends Mapper<MedicalRecord> {
  
  public static toDTO(medicalrecord: MedicalRecord): IMedicalRecordDTO {
    return {
        id: medicalrecord.id.toString(),
        patientId: medicalrecord.patientId,
        allergies: medicalrecord.allergies,
        medicalConditions: medicalrecord.medicalConditions,
        freeText: medicalrecord.freeText,
    } as IMedicalRecordDTO;
  }


  public static toDomain (medicalRecord: any | Model<IMedicalRecordPersistence & Document> ): MedicalRecord {
    const medicalRecordOrError = MedicalRecord.create(medicalRecord, new UniqueEntityID(medicalRecord.domainId));

    medicalRecordOrError.isFailure ? console.log(medicalRecordOrError.error) : '';

    return medicalRecordOrError.isSuccess ? medicalRecordOrError.getValue() : null;
  }

  public static toPersistence (medicalRecord: MedicalRecord): any {
    return {
        domainId: medicalRecord.id.toString(),
        patientId: medicalRecord.patientId,
        allergies: medicalRecord.allergies,
        medicalConditions: medicalRecord.medicalConditions,
        freeText: medicalRecord.freeText
    };
  }
}