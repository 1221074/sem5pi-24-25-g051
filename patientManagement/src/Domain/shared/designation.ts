import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";

interface DesignationProps {
  designation: string;
}

export class Designation extends ValueObject<DesignationProps> {
  get designation (): string {
      return this.props.designation;
  }

  set designation (value: string) {
      this.props.designation = value;
  }
  private constructor (props: DesignationProps) {
    super(props);
  }

  public static create (text: string): Result<Designation> {
    if (text === null || text === undefined || text.trim().length === 0) {
      return Result.fail<Designation>('Must provide a designation that is not empty');
    } else if (text.length > 100){
      return Result.fail<Designation>('Designation is too long');
    } else {
      const designation = new Designation({ designation: text });
      return Result.ok<Designation>( designation )
    }
  }
}
