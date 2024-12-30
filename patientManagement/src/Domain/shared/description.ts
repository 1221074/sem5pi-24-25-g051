import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";

interface DescriptionProps {
  description: string;
}

export class Description extends ValueObject<DescriptionProps> {
  get description (): string {
      return this.props.description;
  }

  set description (value: string) {
      this.props.description = value;
  }

  private constructor (props: DescriptionProps) {
    super(props);
  }

  public static create (text: string): Result<Description> {
    if (text === null || text === undefined || text.trim().length === 0) {
      return Result.fail<Description>('Must provide a description not empty');
    } else if (text.length > 2048){
      return Result.fail<Description>('Description is too long, max 2048 characters');
    } else {
      const description = new Description({ description: text });
      return Result.ok<Description>( description )
    }
  }
}
