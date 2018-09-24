import { Directive, Input } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

import { AuthenticationService } from '../../services/authentication.service';

@Directive({
  selector: '[appCategoryValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: categoryCodeValidatorDirective, multi: true }]
})
export class categoryCodeValidatorDirective implements Validator {
  @Input('appCategoryValidator') currentCode: string;
  constructor(private authService: AuthenticationService) {}
  validate(control: AbstractControl): ValidationErrors {
    console.log(this.currentCode);
    if(this.authService.categories.length > 0 && control.value != null && control.value.toUpperCase() != this.currentCode.toUpperCase())
      return this.authService.categories.some(e => e.category_code.toUpperCase() === control.value.toUpperCase()) ? { 'codeDuplicate': true } : null;
    else return null;
  }
}
