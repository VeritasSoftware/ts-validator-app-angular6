import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { ObjectValidator, ValidationError, ValidationResult } from '../../core/validate'
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
  validationResult: ValidationResult = null;

   @ViewChild('t') public tooltipName: NgbTooltip;
   @ViewChild('t1') public tooltipCreditCardNo: NgbTooltip;
   @ViewChild('t2') public tooltipId: NgbTooltip;
   @ViewChild('t3') public tooltipPwd: NgbTooltip;
   @ViewChild('t4') public tooltipConfirmPwd: NgbTooltip;
   @ViewChild('t5') public tooltipEmail: NgbTooltip;

  constructor(config: NgbTooltipConfig, private validationService: ValidationService, @Inject(DOCUMENT) document) { 
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
    this.toggleValidateMe(error, errors.length > 0);
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

  toggleValidateMe(p: string, set: boolean) {
    var element = document.getElementById(p);
    if (set) {      
      element.classList.remove("validation-success");
      element.classList.add("validation-failure");
    }
    else
    {
      element.classList.remove("validation-failure");
      element.classList.add("validation-success");
    }
  }

  validateMe(p: string) {
    this.validationResult = this.validationService.validateRegisterUser(this.registerUser);    
    var errors = this.validationResult.IdentifierStartsWith(p);
    var element = document.getElementById(p);
    this.toggleValidateMe(p, errors.length > 0);
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
