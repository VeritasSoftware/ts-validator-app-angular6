import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { ValidationService } from '../../services/validation-service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [ValidationService]
})
export class RegisterModule { }
