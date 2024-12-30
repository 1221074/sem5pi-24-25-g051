import { Service, Inject } from 'typedi';

import { Document, FilterQuery, Model } from 'mongoose';
import { IAllergyPersistence } from '../DataSchema/IAllergyPersistence';
import IAllergyRepo from "../Services/IRepos/IAllergyRepo";
import { Allergy } from "../Domain/allergy/allergy";
import { AllergyId } from "../Domain/allergy/allergyId";
import { AllergyMap } from "../mappers/allergyMapper";

@Service()
export default class AllergyRepo implements IAllergyRepo {
  private models: any;

  constructor(
    @Inject('allergySchema') private allergySchema: Model<IAllergyPersistence & Document>,
    @Inject('logger') private logger
  ) {}
 
  private createBaseQuery(): any {
    return {
      where: {},
    };
  }

  public async exists(allergies: Allergy): Promise<boolean> {
    const idX = allergies.id instanceof AllergyId ? (<AllergyId>allergies.id).toValue() : allergies.id;

    const query = { domainId: idX };
    const allergiesDocument = await this.allergySchema.findOne(
      query as FilterQuery<IAllergyPersistence & Document>,
    );

    return !!allergiesDocument === true;
  }

  public async save(allergy: Allergy): Promise<Allergy> {
    const query = { domainId: allergy.id.toString() };

    const allergyDocument = await this.allergySchema.findOne(query);

    console.log('allergyDocument', allergyDocument);
    try {
      if (allergyDocument === null) {
        const rawAllergy: any = AllergyMap.toPersistence(allergy);

        console.log('rawAllergy', rawAllergy);

        const allergyCreated = await this.allergySchema.create(rawAllergy);

        return AllergyMap.toDomain(allergyCreated);
      } else {
        allergyDocument.name = allergy.name;
        allergyDocument.description = allergy.description;
        await allergyDocument.save();

        return allergy;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByDomainId(allergyId: AllergyId | string): Promise<Allergy> {
    const query = { domainId: allergyId };
    const allergyRecord = await this.allergySchema.findOne(query as FilterQuery<IAllergyPersistence & Document>);

    if (allergyRecord != null) {
      return AllergyMap.toDomain(allergyRecord);
    } else {
      return null;
    }
  }

  public async getAllAllergies(): Promise<Allergy[]> {
    try {
      const allergiesDocuments = await this.allergySchema.find().exec();

      if (!allergiesDocuments) {
        return [];
      }

      return allergiesDocuments.map((allergiesDocument) => AllergyMap.toDomain(allergiesDocument));
    } catch (error) {
      throw new Error(`Error returning allergies from repo.: ${error.message}`);
    }
  }
}
