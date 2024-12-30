import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { MedicalConditionId } from "./medicalconditionId";
import { IMedicalConditionDTO } from "../../dto/IMedicalConditionDTO";
import {Description} from "../shared/description";


interface MedicalConditionProps {
    name: string;
    description: string;
}

export class MedicalCondition extends AggregateRoot<MedicalConditionProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  set name(value: string) {
    this.props.name = value;
  }

  get description(): string {
    return this.props.description;
  }

  set description(value: string) {
    this.props.description = value;
  }

  private constructor(props: MedicalConditionProps, id?: UniqueEntityID) {
    super(props, id);
  }
  public static create (medicalConditionDTO: IMedicalConditionDTO, id?: UniqueEntityID): Result<MedicalCondition> {
        const aDescription = Description.create(medicalConditionDTO.description);
       const aName = medicalConditionDTO.name; 
   
       if (aDescription.isFailure) {
         return Result.fail<MedicalCondition>(aDescription.error.toString());
       }else if (!aName) {
           return Result.fail<MedicalCondition>("Name is required");
       } else {
         const medicalCondition = new MedicalCondition(
           {
             name: aName, 
             description: aDescription.getValue().description, 
           },
           id
         );
         return Result.ok<MedicalCondition>(medicalCondition);
    }
  };
}
