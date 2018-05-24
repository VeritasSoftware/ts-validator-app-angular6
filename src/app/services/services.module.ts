import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidationService } from './validation-service'

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [ValidationService],
  declarations: []
})
export class ServicesModule { }
