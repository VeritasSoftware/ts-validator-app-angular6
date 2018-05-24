import {Injectable} from '@angular/core'

import { IValidationService } from './ivalidation-service'
import { User, RegisterUser } from '../models/models.component'
import { Validator, ValidationResult } from '../core/validate';

@Injectable()
export class ValidationService implements IValidationService {
    
    validateUser(model: User) : ValidationResult {
        return new Validator(model)
                    .NotEmpty(m => m.Id, "Id cannot be empty")
                    .NotEmpty(m => m.Pwd, "Pwd cannot be empty")
                .Exec();
    }                           

    validateRegisterUser(model: RegisterUser) : ValidationResult {
        return new Validator(model)
                    .NotEmpty(m => m.Name, "Name cannot be empty")
                    .NotEmpty(m => m.CreditCardNo, "Credit Card Number cannot be empty")                    
                    .If(m => m.CreditCardNo != "", validator =>
                                                        validator.For(m => m.CreditCardNo, creditCardValidator =>
                                                                                                creditCardValidator.Length(13, 19, "Credit Card Number length is invalid")
                                                                                                                   .CreditCard("Credit Card Number is invalid")
                                                                                            .Exec()
                                                                     )                                                                
                                                    .Exec())
                    .NotEmpty(m => m.Id, "Id cannot be empty")
                    .NotEmpty(m => m.Email, "Email cannot be empty")
                    .If(m => m.Email != "", validator =>
                                                        validator.Email(m => m.Email, "Email is invalid")
                                            .Exec())
                    .NotEmpty(m => m.Password, "Pwd cannot be empty")
                    .NotEmpty(m => m.ConfirmPassword, "Confirm Pwd cannot be empty") 
                    .If(m => m.Password != "", validator =>
                                                    validator.For(m => m.Password, passwordValidator => 
                                                                                        passwordValidator.Matches("(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])", "Password strength is not valid")
                                                                                                         .Required((m, pwd) => pwd.length > 3, "Password length should be greater than 3") 
                                                                                                         .Required((m, pwd) => pwd == m.ConfirmPassword, "Password and Confirm Password are not the same")
                                                                                   .Exec()
                                                                 )
                                               .Exec())                    
                .Exec();
    }
}