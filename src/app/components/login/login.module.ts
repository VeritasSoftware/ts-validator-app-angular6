import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { ValidationService } from '../../services/validation-service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule    
  ],
  providers: [ValidationService],
  declarations: [LoginComponent]
})
export class LoginModule { }
