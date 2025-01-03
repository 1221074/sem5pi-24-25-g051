import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { IfreeTextDTO } from "../../dto/IFreeTextDTO";
import { Description } from "../shared/description";
import { Designation } from "../shared/designation";


interface FreeTextProps {
    freeText: string;
    medicalRecordID: string;
}
export class FreeText extends AggregateRoot<FreeTextProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get freeText(): string {
        return this.props.freeText;
    }
    set freeText(value: string) {
        this.props.freeText = value;
    }

    get medicalRecordID(): string {
        return this.props.medicalRecordID;
    }

    set medicalRecordID(value: string) {
        this.props.medicalRecordID = value;
    }

    public static create(freeTextDTO: IfreeTextDTO, id?: UniqueEntityID): Result<FreeText>  {
        const text = freeTextDTO.freeText;
        const medicalRecordID = Designation.create(freeTextDTO.medicalRecordID);
        const freeTextValidation = Description.create(text);
        if (freeTextValidation.isFailure) {
            return Result.fail<FreeText>("Text is required");
        } else if (medicalRecordID.isFailure) {
            return Result.fail<FreeText>("Medical Record is required");
        } else {
            const freeText = new FreeText(
                {
                    freeText: freeTextValidation.getValue().description,
                    medicalRecordID: medicalRecordID.getValue().designation
                },
                id
            );
            return Result.ok<FreeText>(freeText);
        }
    }

}
