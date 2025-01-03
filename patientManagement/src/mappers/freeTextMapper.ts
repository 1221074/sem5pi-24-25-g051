import { Mapper } from "../core/infra/Mapper";
import { Document, Model } from 'mongoose';
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { IFreeTextPersistence } from '../DataSchema/IFreeTextPersistence';
import { IfreeTextDTO } from "../dto/IFreeTextDTO";
import { FreeText } from "../Domain/freetext/FreeText";
import { identity } from "lodash";
import { text } from "body-parser";

export class FreeTextMap extends Mapper<FreeText> {
  
  public static toDTO(freeText: FreeText): IfreeTextDTO {
    return {
        id: freeText.id.toString(),
        freeText: freeText.freeText,
        medicalRecordID: freeText.medicalRecordID,
    } as IfreeTextDTO;
  }


  public static toDomain (freeText: any | Model<IFreeTextPersistence & Document> ): FreeText {
    const FreeTextOrError = FreeText.create(freeText, new UniqueEntityID(freeText.domainId));

    FreeTextOrError.isFailure ? console.log(FreeTextOrError.error) : '';

    return FreeTextOrError.isSuccess ? FreeTextOrError.getValue() : null;
  }

  public static toPersistence (freeText: FreeText): any {

    return {
        domainId: freeText.id.toString(),
        medicalRecordID: freeText.medicalRecordID,
        freeText: freeText.freeText,
    };
  }
}