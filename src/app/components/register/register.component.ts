import { Component, OnInit, ViewChild } from '@angular/core';

import { Validator, ValidationError, ValidationResult } from '../../core/validate'
import {NgbTooltip, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import { RegisterUser } from '../../models/models.component'
import { ValidationService } from '../../services/validation-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)'
  },
  providers: [NgbTooltipConfig, ValidationService]
})
export class RegisterComponent implements OnInit {
  title: string = "Register"
  registerUser : RegisterUser;
  validationResult: ValidationResult;

   @ViewChild('t') public tooltipName: NgbTooltip;
   @ViewChild('t1') public tooltipCreditCardNo: NgbTooltip;
   @ViewChild('t2') public tooltipId: NgbTooltip;
   @ViewChild('t3') public tooltipPwd: NgbTooltip;
   @ViewChild('t4') public tooltipConfirmPwd: NgbTooltip;
   @ViewChild('t5') public tooltipEmail: NgbTooltip;


  constructor(config: NgbTooltipConfig, private validationService: ValidationService) { 
    config.placement = 'top';
    config.triggers = 'manual';
  }

  ngOnInit() {
    this.registerUser = new RegisterUser("", "", "", "", "", "");
  }

  onResize(event){
    this.validateForm();
  }

  showValidationTooltip(error: string, tooltip: NgbTooltip): void {    
    tooltip.close();
    var errors = this.validationResult.IdentifierStartsWith(error);
    if (errors != null && errors.length > 0) {
      setTimeout(()=> tooltip.open());    
    }    
  } 

  showValidationTooltips() : void {
    this.showValidationTooltip("Name", this.tooltipName); 
    this.showValidationTooltip("CreditCardNo", this.tooltipCreditCardNo); 
    this.showValidationTooltip("Id", this.tooltipId);
    this.showValidationTooltip("Password", this.tooltipPwd); 
    this.showValidationTooltip("ConfirmPassword", this.tooltipConfirmPwd); 
    this.showValidationTooltip("Email", this.tooltipEmail);
  }  

  validateMe(p: string) {
    this.validationResult = this.validationService.validateRegisterUser(this.registerUser);    
    var errors = this.validationResult.IdentifierStartsWith(p);
    return !(errors != null && errors.length > 0);     
  }

  validateForm() {
    this.validationResult = this.validationService.validateRegisterUser(this.registerUser);

    this.validationResult.IsValid ?
      alert("Congrats! Validation passed.") :
      this.showValidationTooltips();       
  }

  register() {
    this.validateForm();                            
 }
}
