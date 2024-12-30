import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

import { Result } from "../../core/logic/Result";
import { Description } from "../shared/description";
import {IAllergyDTO } from "../../dto/IAllergyDTO";

interface AllergyProps {
  name: string;
  description: string;
}

export class Allergy extends AggregateRoot<AllergyProps> {
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

  private constructor(props: AllergyProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(allergyDTO: IAllergyDTO, id?: UniqueEntityID): Result<Allergy> {
    const aDescription = Description.create(allergyDTO.description);
    const aName = allergyDTO.name; 

    if (aDescription.isFailure) {
      return Result.fail<Allergy>(aDescription.error.toString());
    }else if (!aName) {
        return Result.fail<Allergy>("Name is required");
    } else {
      const allergy = new Allergy(
        {
          name: aName, 
          description: aDescription.getValue().description, 
        },
        id
      );
      return Result.ok<Allergy>(allergy);
    }
  }
}
