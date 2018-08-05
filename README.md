# Angular 6 CLI app to demo the ts.validator TypeScript based generic validation framework.

[**ts.validator framework on GitHub**](https://github.com/VeritasSoftware/ts.validator)

[**Article on framework**](https://www.c-sharpcorner.com/article/ts-validator-typescript-based-generic-validation-framework/)

| Login | Register |
| --- | -- |
| ![Login validation](https://github.com/VeritasSoftware/ts-validator-app-angular6/blob/master/src/Login.jpg) | ![Register validation](https://github.com/VeritasSoftware/ts-validator-app-angular6/blob/master/src/Register.jpg) | 

The app uses a **Service oriented approach to client-side validation**, with the below advantages:

*   The business rules around validation are separated from the components.
*   The business rules are centralized in the validation service.
*   The service is re-usable.
*   The service can be injected into any component. 
*   You can unit test the business rules by unit testing the service.

 ```typescript
import {Injectable} from '@angular/core'

import { IValidationService } from './ivalidation-service'
import { User, RegisterUser } from '../models/models.component'
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
            .NotEmpty(m => m.Id, "Id cannot be empty")
            .NotEmpty(m => m.Pwd, "Pwd cannot be empty")
        .Exec();
    };

    validateRegisterUserRules = (validator: IValidator<RegisterUser>) : ValidationResult => {
        return validator
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
    };    
}
```

In the Component, 

*   the injected Validation Service is invoked to perform the validation. 
*   this can be Sync or Async validation.
*   The components, Login and Register, inherit from ComponentBase.

Base component class:

*   the form-related validation methods are in the base class.
*   the Validation Service is injected into the base class.
*   wrappers like below allow the derived components to leverage these methods.

```typescript
    async validateFormAsync(service:(validationService: ValidationService) => Promise<ValidationResult>) : Promise<boolean> {
        this.validationResult = await service(this.validationService);
        
        this.validationResult.IsValid ?
            alert("Congrats! Validation passed.") :
            this.showValidationTooltips();
            
        return this.validationResult.IsValid;
    }
```
Login component:
```typescript
  async login() {
    var isValidModel = await this.validateFormAsync(validationService => validationService.validateUserAsync(this.loginUser));                           

    if (isValidModel)
    {
      //do processing
    }
  }
```
Register component:
```typescript
  async register() {
    var isValidModel = await this.validateFormAsync(validationService => validationService.validateRegisterUserAsync(this.registerUser)); 
    
    if (isValidModel)
    {
      //do processing
    }
 }
```

*   Html markup of an input element. 
*   Using angular bootstrap Tooltip to display the errors.

```html
        <div class="form-group">
            <label class="col-md-4">Id</label>
            <ng-template #tipContent>  
                <ul class="tooltip-inner">
                    <li *ngFor="let error of validationResult?.IdentifierStartsWith('Id')">
                        {{error.Message}}
                    </li>
                </ul>                                
            </ng-template>
            <input 
                    type="text" 
                    id="Id" 
                    class="form-control" 
                    name="Id"                     
                    [(ngModel)]="loginUser.Id" 
                    (ngModelChange)="!validateMe('Id') ? t.open() : t.close()" 
                    [ngbTooltip]="tipContent"   
                    #t="ngbTooltip" 
                    placeholder="Id" />                  
        </div>
```


### Summary of above code snippets

*   There is a **Validation Service** in the Angular 6 CLI app.
*   All business rules around model validation are centralized in this service.
*   There are 2 models for the **components** **Login** and **Register**. These **models** are **User** and **RegisterUser**.
*   The framework interface **IValidator\<T\>** is used to lay the validation rules for these models.
*   The Validation Service creates 2 sync and 2 async methods to validate these models. 
*   The sync **methods** are **validateUser** and **validateRegisterUser**. The async ones are **validateUserAsync** and **validateRegisterUserAsync**.
*   In the sync methods, the framework method **Validate** is used.
*   In the async methods, the framework method **ValidateAsync** is used.
*   This service is injected into the components.
*   The methods of the service are used for model validation.
*   The **IdentifierStartsWith** API the framework provides is used to display the validation errors.
*   The validation errors are shown in tooltips. But, you can show your errors any how you like.

### Validation Service unit test

*   You can unit test the business rules by unit testing the validation service.

```typescript
  it('User should have 2 validation errors - Async', async () => {
    var model = new User("", "");
    
    //Get Validation Service
    validationService = TestBed.get(ValidationService);

    var validationResult = await validationService.validateUserAsync(model);
    
    expect(validationResult.IsValid).toBeFalsy();
    expect(validationResult.Errors.length == 2).toBeTruthy();

    //Errors
    expect(validationResult.Errors[0].Value == "").toBeTruthy();
    expect(validationResult.Errors[0].Identifier == "Id").toBeTruthy();
    expect(validationResult.Errors[0].Message == "Id cannot be empty").toBeTruthy();
    
    expect(validationResult.Errors[1].Value == "").toBeTruthy();
    expect(validationResult.Errors[1].Identifier == "Pwd").toBeTruthy();
    expect(validationResult.Errors[1].Message == "Pwd cannot be empty").toBeTruthy();
  }); 
```


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
