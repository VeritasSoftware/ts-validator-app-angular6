import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Validator } from './validator';

class Employee {
    Name: string;
    Password: string;
    PreviousPasswords: string[];
    CreditCards: CreditCard[];
    Super: Super;
    Email: string;
 }
 
 class CreditCard {
   Number: number;
   Name: string;
 }
 
 class Super {
    Name: string;
    Code: string;
 }

describe('ValidatorTests', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    
  });

  it('should have no validation errors', () => {
    var model = new Employee();
    model.Name = "John Doe";

    model.Password = "sD4A3";
    model.PreviousPasswords = new Array<string>()     
    model.PreviousPasswords.push("sD4A");
    model.PreviousPasswords.push("sD4A1");
    model.PreviousPasswords.push("sD4A2");

    model.CreditCards = new Array<CreditCard>();
    var masterCard = new CreditCard();
    masterCard.Number = 5105105105105100;
    masterCard.Name = "John Doe"
    var amexCard = new CreditCard();
    amexCard.Number = 371449635398431;
    amexCard.Name = "John Doe"
    model.CreditCards.push(masterCard);
    model.CreditCards.push(amexCard);

    model.Super = new Super();
    model.Super.Name = "XYZ Super Fund";
    model.Super.Code = "XY1234";

    model.Email = "john.doe@xyx.com";

    var validationResult = new Validator(model)                              
                                .NotEmpty(m => m.Name, "Should not be empty", "Employee.Name.Empty")
                                .NotNull(m => m.CreditCards, "Should not be null", "CreditCard.Null")
                                .NotNull(m => m.Super, "Should not be null", "Super.Null")
                                .NotEmpty(m => m.Email, "Should not be empty", "Employee.Email.Empty")
                                .If(m => m.Super != null, validator => validator
                                                                                .NotEmpty(m => m.Super.Name, "Should not be empty", "Super.Code.Empty")
                                                                                .Matches(m => m.Super.Code, "^[a-zA-Z]{2}\\d{4}$", "Should not be invalid", "Super.Code.Invalid")
                                                                      .Exec())
                                .If(m => m.Email != '', validator => 
                                                                    validator.Email(m => m.Email, "Should not be invalid", "Employee.Email.Invalid")
                                                        .Exec())  
                                .Required(m => m.CreditCards, (m, creditCards) => creditCards.length > 0, "Must have atleast 1 credit card", "CreditCard.Required")
                                .If(m => m.CreditCards != null && m.CreditCards.length > 0, 
                                            validator => validator
                                                                .ForEach(m => m.CreditCards, validator => 
                                                                                                  validator.CreditCard(m => m.Number, "Should not be invalid", "CreditCard.Number.Invalid")                                                                                         
                                                                                            .Exec())
                                                        .Exec())
                               .If(m => m.Password != '', validator => 
                                                              validator.For(m => m.Password, passwordValidator =>
                                                                                                passwordValidator.Matches("(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])", "Password strength is not valid")
                                                                                                                 .Required((m, pwd) => pwd.length > 3, "Password length should be greater than 3")
                                                                                                                 .Required((m, pwd) => !m.PreviousPasswords.some(prevPwd => prevPwd == pwd), "Password is already used")
                                                                                             .Exec())
                                                              .Exec())                                                                                                                    
                            .Exec(); 
    
    expect(validationResult.IsValid).toBeTruthy();
  });
});
