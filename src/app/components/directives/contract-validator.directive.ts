import { Directive, Input } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

import { RequestContract } from '../../classes/request';

@Directive({
  selector: '[appContractNoValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: contractNoValidatorDirective, multi: true }]
})
export class contractNoValidatorDirective implements Validator {
  @Input('appContractNoValidator') contracts:any;
  validate(control: AbstractControl): ValidationErrors {
    if(this.contracts.length > 0){
      let contractArray = this.contracts.split(',');
      return contractArray.includes(control.value) ? { 'contractDuplicate': true } : null;
    }    
    else return null;
  }
}
