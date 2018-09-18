import { Directive } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

import { AuthenticationService } from '../../services/authentication.service';

@Directive({
  selector: '[appEmailValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: contactEmailValidatorDirective, multi: true }]
})
export class contactEmailValidatorDirective implements Validator {
  constructor(private authService: AuthenticationService) {}
  validate(control: AbstractControl): ValidationErrors {
    if(this.authService.contacts.length > 0)
      return this.authService.contacts.some(e => e.contact_details.split('-')[1].trim() === control.value) ? { 'emailDuplicate': true } : null;
    else return null;
  }
}
