import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { IfreeTextDTO } from "../../dto/IFreeTextDTO";

interface FreeTextProps {
    text: string;
    medicalRecordID: string;
}
export class FreeText extends AggregateRoot<FreeTextProps> {
    get id(): UniqueEntityID {
        return this.id;
    }

    get text(): string {
        return this.props.text;
    }
    set text(value: string) {
        this.props.text = value;
    }

    get medicalRecordID(): string {
        return this.props.medicalRecordID;
    }

    set medicalRecordID(value: string) {
        this.props.medicalRecordID = value;
    }

    public static create(freeTextDTO: IfreeTextDTO, id?: UniqueEntityID): Result<FreeText>  {
        if (!freeTextDTO.text) {
            return Result.fail<FreeText>("Text is required");
        } else if (!freeTextDTO.medicalRecordID) {
            return Result.fail<FreeText>("Medical Record is required");
        } else {
            const freeText = new FreeText(
                {
                    text: freeTextDTO.text,
                    medicalRecordID: freeTextDTO.medicalRecordID
                },
                id
            );
            return Result.ok<FreeText>(freeText);
        }
    }

}
