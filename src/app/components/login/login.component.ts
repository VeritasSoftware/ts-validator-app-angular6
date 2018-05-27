import { Component, OnInit, ViewChild } from '@angular/core';
import {NgbTooltip, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';

import { Validator, ValidationError, ValidationResult } from '../../core/validate'
import { User } from '../../models/models.component'
import { ValidationService } from '../../services/validation-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)'
  },
  providers: [NgbTooltipConfig, ValidationService] 
})
export class LoginComponent implements OnInit {
loginUser : User;
Id: string;
Pwd: string;
title: string = "Login"
validationResult: ValidationResult;

   @ViewChild('t') public tooltipId: NgbTooltip;
   @ViewChild('t1') public tooltipPwd: NgbTooltip;

  constructor(config: NgbTooltipConfig, private validationService: ValidationService) {
    config.placement = 'top';
    config.triggers = 'manual';
   }

  ngOnInit() {     
    this.loginUser = new User("", "");
  }

  onResize(event){
    this.validateForm();
  }

  validateMe(p: string) {
    this.validationResult = this.validationService.validateUser(this.loginUser);    
    var errors = this.validationResult.IdentifierStartsWith(p);
    return !(errors != null && errors.length > 0);     
  }

  async validateForm() {
    //Sync
    //this.validationResult = this.validationService.validateUser(this.loginUser);
    //Async
    this.validationResult = await this.validationService.validateUserAsync(this.loginUser);

    this.validationResult.IsValid ?
      alert("Congrats! Validation passed.") :
      this.showValidationTooltips();    
  }

  showValidationTooltips() : void {
    this.showValidationTooltip("Id", this.tooltipId);
    this.showValidationTooltip("Pwd", this.tooltipPwd);
  }

  showValidationTooltip(error: string, tooltip: NgbTooltip): void {    
    tooltip.close();
    var errors = this.validationResult.IdentifierStartsWith(error);
    if (errors != null && errors.length > 0) {
      setTimeout(()=> tooltip.open());    
    }    
  }  

  login() {
     this.validateForm();                            
  }

}
