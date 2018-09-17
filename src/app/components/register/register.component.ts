import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NgbTooltip, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

import { RegisterUser, AgeGroup, AgeGroupEnum } from '../../models/models.component'
import { ComponentBase } from '../common/component-base';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)'
  },
  providers: [NgbTooltipConfig]
})
export class RegisterComponent extends ComponentBase implements OnInit {  
  registerUser : RegisterUser;
  title: string = "Register"
  ageGroups: AgeGroup[];  


   @ViewChild('t') public tooltipName: NgbTooltip;
   @ViewChild('t1') public tooltipCreditCardNo: NgbTooltip;
   @ViewChild('t2') public tooltipId: NgbTooltip;
   @ViewChild('t3') public tooltipPwd: NgbTooltip;
   @ViewChild('t4') public tooltipConfirmPwd: NgbTooltip;
   @ViewChild('t5') public tooltipEmail: NgbTooltip;
   @ViewChild('t6') public tooltipAgeGroup: NgbTooltip;
   @ViewChild('t7') public tooltipIsParentalSupervisionProvided: NgbTooltip;

  constructor(@Inject(DOCUMENT) document, private config: NgbTooltipConfig) { 
    super(document, config);    

    //Assign validation service method to be called in delegate
    this.validationAsyncDelegate = validationService => validationService.validateRegisterUserAsync(this.registerUser);
    this.validationSyncDelegate = validationService => validationService.validateRegisterUser(this.registerUser);
  }

  ngOnInit() {
    this.registerUser = new RegisterUser("", "", "", "", "", "", AgeGroupEnum.None, false);

    this.ageGroups = [
      new AgeGroup(AgeGroupEnum.None, "Choose an age group"),       
      new AgeGroup(AgeGroupEnum.Adult, "Adult"),
      new AgeGroup(AgeGroupEnum.Minor, "Minor (under 18)")
   ];
  }

  async onResize(event){
    //await this.validateFormAsync(this.validationAsyncDelegate); 
  }
  
  validateMe(item: string) : boolean {
    return this.IsValid(item, this.validationSyncDelegate);
  }

  /* Override of base class method */
  showValidationTooltips() : void {
    this.showValidationTooltip("Name", this.tooltipName); 
    this.showValidationTooltip("CreditCardNo", this.tooltipCreditCardNo); 
    this.showValidationTooltip("Id", this.tooltipId);
    this.showValidationTooltip("Password", this.tooltipPwd); 
    this.showValidationTooltip("ConfirmPassword", this.tooltipConfirmPwd); 
    this.showValidationTooltip("Email", this.tooltipEmail);
    this.showValidationTooltip("AgeGroup", this.tooltipAgeGroup);    
    this.showValidationTooltip("IsParentalSupervisionProvided", this.tooltipIsParentalSupervisionProvided);
  }    

  async register() {
    var isValidModel = await this.validateFormAsync(this.validationAsyncDelegate); 
    
    if (isValidModel)
    {
      //do processing
    }
 }
}
