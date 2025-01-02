import { Service, Inject } from 'typedi';

import { Document, FilterQuery, IfAny, Model } from 'mongoose';
import { IFreeTextPersistence } from '../DataSchema/IFreeTextPersistence';
import { FreeText } from "../Domain/freetext/FreeText";
import { FreeTextID } from "../Domain/freetext/FreeTextID";
import { FreeTextMap } from "../mappers/freeTextMapper";
import IFreeTextRepo from '../Services/IRepos/IFreeTextRepo';

@Service()
export default class FreeTextRepo implements IFreeTextRepo {
  private models: any;

  constructor(
    @Inject('FreeTextSchema') private freeTextSchema: Model<IFreeTextPersistence & Document>,
    @Inject('logger') private logger
  ) {}

  
 
  private createBaseQuery(): any {
    return {
      where: {},
    };
  }

  public async exists(freeText: FreeText): Promise<boolean> {
    const idX = freeText.id instanceof FreeTextID ? (<FreeTextID>freeText.id).toValue() : freeText.id;

    const query = { domainId: idX };
    const freeTextDocument = await this.freeTextSchema.findOne(
      query as FilterQuery<IFreeTextPersistence & Document>,
    );

    return !!freeTextDocument === true;
  }

  public async save(freeText: FreeText): Promise<FreeText> {
    const query = { domainId: freeText.id.toString() };
    const freeTextDocument = await this.freeTextSchema.findOne(query);
    try {
      if (freeTextDocument === null) {
        const rawFreeText: any = FreeTextMap.toPersistence(freeText);

      

        const freeTextCreated = await this.freeTextSchema.create(rawFreeText);

        return FreeTextMap.toDomain(freeTextCreated);
      } else {
        freeTextDocument.freeText = freeText.freeText;
        freeTextDocument.medicalRecordID = freeText.medicalRecordID;
        await freeTextDocument.save();

        return freeText;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByDomainId(freeTextID: FreeTextID | string): Promise<FreeText> {
    const query = { domainId: freeTextID };
    const freeTextRecord = (await this.freeTextSchema.findOne(query as FilterQuery<IFreeTextPersistence & Document>));

    if (freeTextRecord != null) {
      return FreeTextMap.toDomain(freeTextRecord);
    } else {
      return null;
    }
  }

  public async findByMedicalRecordID(medicalRecordID: string): Promise<FreeText[]> {
    console.log(medicalRecordID);
    try{
      const query = { medicalRecordID: medicalRecordID };
      const freeTextDocuments = (await this.freeTextSchema.find(query as FilterQuery<IFreeTextPersistence & Document>).exec());

      if (!freeTextDocuments) {
        return [];
      }

      return freeTextDocuments.map((freeTextDocument) => FreeTextMap.toDomain(freeTextDocument));
    } catch (error) {
      throw new Error(`Error returning free text from repo.: ${error.message}`);
    }
  }

  public async getAllFreeTexts(): Promise<FreeText[]> {
    try {
      const freeTextDocuments = await this.freeTextSchema.find().exec();

      if (!freeTextDocuments) {
        return [];
      }

      return freeTextDocuments.map((freeTextDocuments) => FreeTextMap.toDomain(freeTextDocuments));
    } catch (error) {
      throw new Error(`Error returning medical records from repo.: ${error.message}`);
    }
  }
}
