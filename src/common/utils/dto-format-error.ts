import { ValidationError } from 'class-validator';

export function formatDtoErrors(errors: ValidationError[]) {
  return errors.map((err) => ({
    property: err.property,
    constraints: err.constraints,
  }));
}
