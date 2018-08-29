import {Injectable} from '@angular/core';

import { IValidationService } from './ivalidation-service';
import { User, RegisterUser } from '../models/models.component';
import { IValidator, Validator, ValidationResult } from '../core/validate';

@Injectable()
export class ValidationService implements IValidationService {
    
    validateUser(model: User) : ValidationResult {
        return new Validator(model).Validate(this.validateUserRules);
    }  

    async validateUserAsync(model: User) : Promise<ValidationResult> {
        return await new Validator(model).ValidateAsync(this.validateUserRules);        
    }

    validateRegisterUser(model: RegisterUser) : ValidationResult {
        return new Validator(model).Validate(this.validateRegisterUserRules);
    }

    async validateRegisterUserAsync(model: RegisterUser) : Promise<ValidationResult> {
        return await new Validator(model).ValidateAsync(this.validateRegisterUserRules);
    }
    
    validateUserRules = (validator: IValidator<User>) : ValidationResult => {
        return validator 
            .NotEmpty(m => m.Id, "Id cannot be empty", "Id")
            .NotEmpty(m => m.Pwd, "Pwd cannot be empty", "Pwd")
        .ToResult();
    };

    validateRegisterUserRules = (validator: IValidator<RegisterUser>) : ValidationResult => {
        return validator
            .NotEmpty(m => m.Name, "Name cannot be empty", "Name:Empty")
            .NotEmpty(m => m.CreditCardNo, "Credit Card Number cannot be empty", "CreditCardNo:Empty")                    
            .If(m => m.CreditCardNo != "", validator =>
                                                validator.For(m => m.CreditCardNo, creditCardValidator =>
                                                                                        creditCardValidator.Length(13, 19, "Credit Card Number length is invalid", "CreditCardNo:LengthInvalid")
                                                                                                           .CreditCard("Credit Card Number is invalid", "CreditCardNo:Invalid")
                                                                                    .ToResult()
                                                             )                                                                
                                            .ToResult())
            .NotEmpty(m => m.Id, "Id cannot be empty", "Id:Empty")
            .NotEmpty(m => m.Email, "Email cannot be empty", "Email:Empty")
            .If(m => m.Email != "", validator =>
                                                validator.Email(m => m.Email, "Email is invalid", "Email:Invalid")
                                    .ToResult())
            .NotEmpty(m => m.Password, "Pwd cannot be empty", "Password:Empty")
            .NotEmpty(m => m.ConfirmPassword, "Confirm Pwd cannot be empty", "ConfirmPassword:Empty") 
            .If(m => m.Password != "", validator =>
                                            validator.For(m => m.Password, passwordValidator => 
                                                                                passwordValidator.Matches("(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])", "Password strength is not valid", "Password:InvalidStrength")
                                                                                                 .Required((m, pwd) => pwd.length > 3, "Password length should be greater than 3", "Password:LengthInvalid") 
                                                                                                 .Required((m, pwd) => pwd == m.ConfirmPassword, "Password and Confirm Password are not the same", "Password:ConfirmNotSame")
                                                                          .ToResult()
                                                         )
                                      .ToResult())                    
        .ToResult();
    };    
}