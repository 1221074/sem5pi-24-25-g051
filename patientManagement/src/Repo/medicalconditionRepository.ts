import { Service, Inject } from 'typedi';

import { Document, FilterQuery, Model } from 'mongoose';
import { IMedicalConditionPersistence } from '../DataSchema/IMedicalConditionPersistence';
import IMedicalConditionRepo from "../Services/IRepos/IMedicalConditionRepo";
import { MedicalCondition } from "../Domain/medicalcondition/medicalcondition";
import { MedicalConditionId } from "../Domain/medicalcondition/medicalconditionId";
import { MedicalConditionMap } from "../mappers/medicalconditionMapper";

@Service()
export default class MedicalConditionRepo implements IMedicalConditionRepo {
  private models: any;

  constructor(
    @Inject('MedicalConditionSchema') private medicalconditionSchema: Model<IMedicalConditionPersistence & Document>,
    @Inject('logger') private logger
  ) {}
  
 
  private createBaseQuery(): any {
    return {
      where: {},
    };
  }

  public async exists(medicalcondition: MedicalCondition): Promise<boolean> {
    const idX = medicalcondition.id instanceof MedicalConditionId ? (<MedicalConditionId>medicalcondition.id).toValue() : medicalcondition.id;

    const query = { domainId: idX };
    const medicalconditionDocument = await this.medicalconditionSchema.findOne(
      query as FilterQuery<IMedicalConditionPersistence & Document>,
    );

    return !!medicalconditionDocument === true;
  }

  public async save(medicalcondition: MedicalCondition): Promise<MedicalCondition> {
    const query = { domainId: medicalcondition.id.toString() };

    const medicalconditionDocument = await this.medicalconditionSchema.findOne(query);

    console.log('medicalConditionDocument', medicalconditionDocument);
    try {
      if (medicalconditionDocument === null) {
        const rawMedicalCondition: any = MedicalConditionMap.toPersistence(medicalcondition);

        console.log('rawMedicalCondition', rawMedicalCondition);

        const medicalConditionCreated = await this.medicalconditionSchema.create(rawMedicalCondition);

        return MedicalConditionMap.toDomain(medicalConditionCreated);
      } else {
        medicalconditionDocument.name = medicalcondition.name;
        medicalconditionDocument.description = medicalcondition.description;
        await medicalconditionDocument.save();

        return medicalcondition;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByDomainId(medicalConditionId: MedicalConditionId | string): Promise<MedicalCondition> {
    const query = { domainId: medicalConditionId };
    const medicalconditionRecord = await this.medicalconditionSchema.findOne(query as FilterQuery<IMedicalConditionPersistence & Document>);

    if (medicalconditionRecord != null) {
      return MedicalConditionMap.toDomain(medicalconditionRecord);
    } else {
      return null;
    }
  }

  public async getAllMedicalConditions(): Promise<MedicalCondition[]> {
    try {
      const medicalconditionsDocuments = await this.medicalconditionSchema.find().exec();

      if (!medicalconditionsDocuments) {
        return [];
      }

      return medicalconditionsDocuments.map((medicalconditionsDocuments) => MedicalConditionMap.toDomain(medicalconditionsDocuments));
    } catch (error) {
      throw new Error(`Error returning medical conditions from repo.: ${error.message}`);
    }
  }
}
