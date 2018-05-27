# Angular 6 CLI app to demo the ts.validator TypeScript based generic validation framework.

[**ts.validator framework on GitHub**](https://github.com/VeritasSoftware/ts.validator)

[**Article on framework**](https://www.c-sharpcorner.com/article/ts-validator-typescript-based-generic-validation-framework/)

| Initial | After validation |
| --- | --- |
| ![Login initial](https://github.com/VeritasSoftware/ts-validator-app-angular6/blob/master/src/Login_1.jpg) | ![Login validation](https://github.com/VeritasSoftware/ts-validator-app-angular6/blob/master/src/Login_2.jpg) | 

*   The business rules around model validation remain centralized in the validation service.
*   This service can be injected into any component. 

 ```typescript
import {Injectable} from '@angular/core'

import { IValidationService } from './ivalidation-service'
import { User, RegisterUser } from '../models/models.component'
import { Validator, ValidationResult, ValidatorAsync } from '../core/validate';

@Injectable()
export class ValidationService implements IValidationService {
    
    validateUser(model: User) : ValidationResult {
        return new Validator(model)
                    .NotEmpty(m => m.Id, "Id cannot be empty")
                    .NotEmpty(m => m.Pwd, "Pwd cannot be empty")
                .Exec();
    }  

    async validateUserAsync(model: User) : Promise<ValidationResult> {
        return await new ValidatorAsync(model).Validate(validator => validator
                                                            .NotEmpty(m => m.Id, "Id cannot be empty")
                                                            .NotEmpty(m => m.Pwd, "Pwd cannot be empty")
                                                        .Exec());        
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
                                                                                        passwordValidator.Matches("(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])","Password strength is not valid")
                                                                                                         .Required((m, pwd) => pwd.length > 3, "Password length should be greater than 3") 
                                                                                                         .Required((m, pwd) => pwd == m.ConfirmPassword, "Password and Confirm Password are not the same")
                                                                                   .Exec()
                                                                 )
                                               .Exec())                    
                .Exec();
    }
}
```

**In the above code snippet:**

*   There is a **Validation Service** in the Angular 6 CLI app.
*   All business rules around model validation are centralized in this service.
*   There are 2 models for the **components** **Login** and **Register**. These **models** are **User** and **RegisterUser**.
*   The Validation Service creates 2 sync methods to validate these models. These **methods** are **validateUser** and **validateRegisterUser**.
*   In these methods, the framework class **Validator** is used to lay the validation rules for the models.
*   In the async **validateUserAsync** method, the framework class **ValidatorAsync** is used.
*   This service is injected into the components.
*   The methods of the service are used for model validation.



## Angular info

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
