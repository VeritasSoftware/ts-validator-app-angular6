import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NgbTooltip, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

import { User } from '../../models/models.component'
import { ComponentBase } from '../common/component-base'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)'
  },
  providers: [NgbTooltipConfig] 
})
export class LoginComponent extends ComponentBase implements OnInit {
loginUser : User;
title: string = "Login"

   @ViewChild('t') public tooltipId: NgbTooltip;
   @ViewChild('t1') public tooltipPwd: NgbTooltip;

  constructor(@Inject(DOCUMENT) document, private config: NgbTooltipConfig) {
      super(document, config);          
      
      //Assign validation service method to be called in delegate
      this.validationAsyncDelegate = validationService => validationService.validateUserAsync(this.loginUser);
      this.validationSyncDelegate = validationService => validationService.validateUser(this.loginUser);
   }

  ngOnInit() {     
    this.loginUser = new User("", "");
  }

  async onResize(event){
    //await this.validateFormAsync(this.validationAsyncDelegate);
  }  

  validateMe(item: string) : boolean {
    return this.IsValid(item, this.validationSyncDelegate);
  }

  /* Override of base class method */
  showValidationTooltips() : void {
    this.showValidationTooltip("Id", this.tooltipId);
    this.showValidationTooltip("Pwd", this.tooltipPwd);
  }  

  async login() {
    var isValidModel = await this.validateFormAsync(this.validationAsyncDelegate);                           

    if (isValidModel)
    {
      //do processing
    }
  }

}


