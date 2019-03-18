import * as Joi from 'joi';
import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = Joi.validate(value, this.schema);

    console.log('Joi Validation:', error);

    if (error) {
      throw new BadRequestException('Validation failed');
    }

    return value;
  }
}
