import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { ObjectValidator, ValidationError, ValidationResult } from '../../core/validate'
import {NgbTooltip, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import { RegisterUser } from '../../models/models.component'
import { ValidationService } from '../../services/validation-service';
import { ComponentBase } from '../common/component-base';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)'
  },
  providers: [NgbTooltipConfig, ValidationService]
})
export class RegisterComponent extends ComponentBase implements OnInit {  
  registerUser : RegisterUser;
  title: string = "Register"
  validationAsyncDelegate = validationService => validationService.validateRegisterUserAsync(this.registerUser);
  validationSyncDelegate = validationService => validationService.validateRegisterUser(this.registerUser);

   @ViewChild('t') public tooltipName: NgbTooltip;
   @ViewChild('t1') public tooltipCreditCardNo: NgbTooltip;
   @ViewChild('t2') public tooltipId: NgbTooltip;
   @ViewChild('t3') public tooltipPwd: NgbTooltip;
   @ViewChild('t4') public tooltipConfirmPwd: NgbTooltip;
   @ViewChild('t5') public tooltipEmail: NgbTooltip;

  constructor(@Inject(DOCUMENT) document) { 
    super(document);
  }

  ngOnInit() {
    this.registerUser = new RegisterUser("", "", "", "", "", "");
  }

  async onResize(event){
    await this.validateForm(this.validationAsyncDelegate); 
  }
  
  validateMe(item: string) : boolean {
    return this.IsValid(item, this.validationSyncDelegate);
  }

  showValidationTooltips() : void {
    this.showValidationTooltip("Name", this.tooltipName); 
    this.showValidationTooltip("CreditCardNo", this.tooltipCreditCardNo); 
    this.showValidationTooltip("Id", this.tooltipId);
    this.showValidationTooltip("Password", this.tooltipPwd); 
    this.showValidationTooltip("ConfirmPassword", this.tooltipConfirmPwd); 
    this.showValidationTooltip("Email", this.tooltipEmail);
  }    

  async register() {
     await this.validateForm(this.validationAsyncDelegate);                            
 }
}
