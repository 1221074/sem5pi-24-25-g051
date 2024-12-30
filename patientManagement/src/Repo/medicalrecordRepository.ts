import { Service, Inject } from 'typedi';

import { Document, FilterQuery, Model } from 'mongoose';
import { IMedicalRecordPersistence } from '../DataSchema/IMedicalRecordPersistence';
import { MedicalRecord } from "../Domain/medicalrecord/medicalrecord";
import { MedicalRecordId } from "../Domain/medicalrecord/medicalrecordId";
import { MedicalRecordMap } from "../mappers/medicalrecordMapper";
import IMedicalRecordRepo from '../Services/IRepos/IMedicalRecordRepo';

@Service()
export default class MedicalRecordRepo implements IMedicalRecordRepo {
  private models: any;

  constructor(
    @Inject('MedicalRecordSchema') private medicalrecordSchema: Model<IMedicalRecordPersistence & Document>,
    @Inject('logger') private logger
  ) {}

  
 
  private createBaseQuery(): any {
    return {
      where: {},
    };
  }

  public async exists(medicalrecord: MedicalRecord): Promise<boolean> {
    const idX = medicalrecord.id instanceof MedicalRecordId ? (<MedicalRecordId>medicalrecord.id).toValue() : medicalrecord.id;

    const query = { domainId: idX };
    const medicalrecordDocument = await this.medicalrecordSchema.findOne(
      query as FilterQuery<IMedicalRecordPersistence & Document>,
    );

    return !!medicalrecordDocument === true;
  }

  public async save(medicalrecord: MedicalRecord): Promise<MedicalRecord> {
    const query = { domainId: medicalrecord.id.toString() };

    const medicalrecordDocument = await this.medicalrecordSchema.findOne(query);

    try {
      if (medicalrecordDocument === null) {
        const rawMedicalRecord: any = MedicalRecordMap.toPersistence(medicalrecord);

      

        const medicalRecordCreated = await this.medicalrecordSchema.create(rawMedicalRecord);

        return MedicalRecordMap.toDomain(medicalRecordCreated);
      } else {
        medicalrecordDocument.patientId = medicalrecord.patientId;
        medicalrecordDocument.allergies = medicalrecord.allergies;
        medicalrecordDocument.medicalConditions = medicalrecord.medicalConditions;
        medicalrecordDocument.freeText = medicalrecord.freeText;
        await medicalrecordDocument.save();

        return medicalrecord;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByDomainId(medicalRecordId: MedicalRecordId | string): Promise<MedicalRecord> {
    const query = { domainId: medicalRecordId };
    const medicalrecordRecord = (await this.medicalrecordSchema.findOne(query as FilterQuery<IMedicalRecordPersistence & Document>));

    if (medicalrecordRecord != null) {
      return MedicalRecordMap.toDomain(medicalrecordRecord);
    } else {
      return null;
    }
  }

  public async findByPatientId(patientId: string): Promise<MedicalRecord> {
    const query = { patientId: patientId };
    const medicalrecordRecord = (await this.medicalrecordSchema.findOne(query as FilterQuery<IMedicalRecordPersistence & Document>));

    if (medicalrecordRecord != null) {
      return MedicalRecordMap.toDomain(medicalrecordRecord);
    } else {
      return null;
    }
  }

  public async getAllMedicalRecords(): Promise<MedicalRecord[]> {
    try {
      const medicalrecordsDocuments = await this.medicalrecordSchema.find().exec();

      if (!medicalrecordsDocuments) {
        return [];
      }

      return medicalrecordsDocuments.map((medicalrecordsDocuments) => MedicalRecordMap.toDomain(medicalrecordsDocuments));
    } catch (error) {
      throw new Error(`Error returning medical records from repo.: ${error.message}`);
    }
  }
}
