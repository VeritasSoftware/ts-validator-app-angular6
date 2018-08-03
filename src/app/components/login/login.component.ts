import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {NgbTooltip, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';

import { ObjectValidator, ValidationError, ValidationResult } from '../../core/validate'
import { User } from '../../models/models.component'
import { ValidationService } from '../../services/validation-service';
import { ComponentBase } from '../common/component-base'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)'
  },
  providers: [NgbTooltipConfig, ValidationService] 
})
export class LoginComponent extends ComponentBase implements OnInit {
loginUser : User;
Id: string;
Pwd: string;
title: string = "Login"
validationDelegate = validationService => validationService.validateUserAsync(this.loginUser); 

   @ViewChild('t') public tooltipId: NgbTooltip;
   @ViewChild('t1') public tooltipPwd: NgbTooltip;

  constructor(@Inject(DOCUMENT) document) {
      super(document);    
   }

  ngOnInit() {     
    this.loginUser = new User("", "");
  }

  async onResize(event){
    await this.validateForm(this.validationDelegate);
  }  

  async validateMe(item: string) {
    this.IsValid(item, this.validationDelegate);
  }

  showValidationTooltips() : void {
    this.showValidationTooltip("Id", this.tooltipId);
    this.showValidationTooltip("Pwd", this.tooltipPwd);
  }  

  async login() {
    await this.validateForm(this.validationDelegate);                           
  }

}


