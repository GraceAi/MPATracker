import { Directive } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';


@Directive({
  selector: '[appPWLinkValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: pwlinkValidatorDirective, multi: true }]
})
export class pwlinkValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors {
    if(control.value != null)
      return !control.value.startsWith("pw") && !control.value.startsWith("PW") ? { 'linkValid': true } : null;
    else return null;
  }
}
