import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator } from '@angular/forms';
import { customValidatorFnFactory, CustomValidator } from './custom-validators-fn-factory';

@Directive({
  selector: '[appCustomValidators]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CustomValidatorsDirective,
      multi: true
    }
  ]
})
export class CustomValidatorsDirective implements Validator {

  private _customValidator: CustomValidator;
  public get appCustomValidators(): CustomValidator {
    return this._customValidator;
  }

  @Input()
  public set appCustomValidators(customValidator: CustomValidator) {
    this._customValidator = customValidator;
    if (this._onChange) {
      this._onChange();
    }
  }
  private _onChange: () => void;
  // constructor() {}
  public validate(control: AbstractControl): { [key: string]: any } {
    return customValidatorFnFactory(this.appCustomValidators)(control);
  }

  public registerOnValidatorChange?(fn: () => void): void {
    this._onChange = fn;
  }

}
