import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Description } from "../shared/description";
import { Designation } from "../shared/designation";

interface MedicalRecordProps {
  patientId: string;
  allergies: string[];
  medicalConditions: string[];
  freeText: string;
}

export class MedicalRecord extends AggregateRoot<MedicalRecordProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get patientId(): string {
    return this.props.patientId;
  }

  set patientId (value: string) {
    this.props.patientId = value;
};

  get allergies(): string[] {
    return this.props.allergies;
  }

  set allergies(value: string[]) {
    this.props.allergies = value;
  }

  get medicalConditions(): string[] {
    return this.props.medicalConditions;
  }

  set medicalConditions(value: string[]) {
    this.props.medicalConditions = value;
  }

  get freeText(): string {
    return this.props.freeText;
  }

  set freeText(value: string) {
    this.props.freeText = value;
  }

  private constructor(props: MedicalRecordProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(patientMedicalRecordDTO: MedicalRecordProps, id?: UniqueEntityID): Result<MedicalRecord> {
    const patientId = Designation.create(patientMedicalRecordDTO.patientId);
    const allergies = patientMedicalRecordDTO.allergies;
    const medicalConditions = patientMedicalRecordDTO.medicalConditions;
    const freeText = patientMedicalRecordDTO.freeText;
   
    if (patientId.isFailure) {
      return Result.fail<MedicalRecord>("Patient ID is required.");
    }

    if (!allergies || !Array.isArray(allergies)) {
      return Result.fail<MedicalRecord>("Allergies must be an array.");
    }

    if (!medicalConditions || !Array.isArray(medicalConditions)) {
      return Result.fail<MedicalRecord>("Medical conditions must be an array.");
    }

    const freeTextValidation = Description.create(freeText);

    if (freeTextValidation.isFailure) {
      return Result.fail<MedicalRecord>(freeTextValidation.error.toString());
    }

    const patientMedicalRecord = new MedicalRecord(
      {
        patientId: patientId.getValue().designation,
        allergies: allergies,
        medicalConditions: medicalConditions,
        freeText: freeTextValidation.getValue().description,
      },
      id
    );

    return Result.ok<MedicalRecord>(patientMedicalRecord);
  }
}
