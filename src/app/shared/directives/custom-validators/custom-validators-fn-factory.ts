import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidator {
  constructor(public expression: () => boolean, public validatorName: string) { }
}

export function customValidatorFnFactory(customValidator: CustomValidator): ValidatorFn {
  return function (control: AbstractControl) {
    const errorObj = {};
    errorObj[customValidator.validatorName] = true;

    return customValidator.expression() ? null : errorObj;
  };
}