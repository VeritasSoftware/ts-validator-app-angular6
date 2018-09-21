import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IValidator } from './ivalidator';
import { Validator } from './validator';
import { ValidationResult } from './validation-result';

class Employee {
    Name: string;
    Password: string;
    PreviousPasswords: string[];
    CreditCards: CreditCard[];
    Super: Super;
    Email: string;
 }

 class Accountant extends Employee {
   Code: string;
 }
 
 class CreditCard {
   Number: number;
   Name: string;
 }
 
 class Super {
    Name: string;
    Code: string;
 }

 class StringAPITest {
   IsLowercase: string;
   IsUppercase: string;
   IsMixedcase: string;
   IsGuid: string;
   IsBase64: string;
   IsUrl: string;
   IsNumeric: string;
   IsAlpha: string;
   IsAlphaNumeric: string;
   Contains: string;
 }

 class StringAPITestProperty {
  StringAPITest: StringAPITest;
 }

 var validateStringAPITest = (validator: IValidator<StringAPITest>) : ValidationResult => {
  return validator
            .IsLowercase(m => m.IsLowercase, "Should be lower case")
            .IsUppercase(m => m.IsUppercase, "Should be upper case")
            .IsMixedcase(m => m.IsMixedcase, "Should be mixed case")
            .IsGuid(m => m.IsGuid, "Should be guid/uuid")
            .IsBase64(m => m.IsBase64, "Should be base64")
            .IsUrl(m => m.IsUrl, "Should be url")
            .IsNumeric(m => m.IsNumeric, "Should be numeric")
            .IsAlpha(m => m.IsAlpha, "Should be alpha")
            .IsAlphaNumeric(m => m.IsAlphaNumeric, "Should be alpha numeric")
            .Contains(m => m.Contains, "test", "Should contain test") 
        .ToResult();
 };

 var validateStringAPITestProperty = (validator: IValidator<StringAPITestProperty>) : ValidationResult => {
   return validator
                .ForType(m => m.StringAPITest, validateStringAPITest)
        .ToResult();
 };

 var validateSuperRules =  (validator: IValidator<Super>) : ValidationResult => {
  return validator
            .NotNull(m => m.Name, "Should not be null", "Super.Name.Null")
            .NotNull(m => m.Code, "Should not be null", "Super.Code.Null")
            .If(m => m.Name != null && m.Code != null, validator => validator 
                                                          .NotEmpty(m => m.Name, "Should not be empty", "Super.Name.Empty")
                                                          .Matches(m => m.Code, "^[a-zA-Z]{2}\\d{4}$", "Should not be invalid", "Super.Code.Invalid")
                                                      .ToResult())
        .ToResult();
 };

  var validateCreditCardRules =  (validator: IValidator<CreditCard>) : ValidationResult => {
  return validator
            .NotNull(m => m.Name, "Should not be null", "CreditCard.Name.Null")
            .NotNull(m => m.Number, "Should not be null", "CreditCard.Number.Null")
            .If(m => m.Name != null && m.Number > 0, validator => validator 
                                                          .NotEmpty(m => m.Name, "Should not be empty", "CreditCard.Name.Empty")
                                                          .CreditCard(m => m.Number, "Should not be invalid", "CreditCard.Number.Invalid")
                                                      .ToResult())
        .ToResult();
 };

 var validateEmployeeRules = (validator: IValidator<Employee>) : ValidationResult => {
    return validator                              
          .NotEmpty(m => m.Name, "Should not be empty", "Employee.Name.Empty")
          .NotNull(m => m.CreditCards, "Should not be null", "CreditCard.Null")
          .NotNull(m => m.Super, "Should not be null", "Super.Null")
          .NotEmpty(m => m.Email, "Should not be empty", "Employee.Email.Empty")
          .If(m => m.Super != null, validator => validator.ForType(m => m.Super, validateSuperRules).ToResult())
          .If(m => m.Email != '', validator => 
                                              validator.Email(m => m.Email, "Should not be invalid", "Employee.Email.Invalid")
                                  .ToResult())  
          .Required(m => m.CreditCards, (m, creditCards) => creditCards.length > 0, "Must have atleast 1 credit card", "CreditCard.Required")
          .If(m => m.CreditCards != null && m.CreditCards.length > 0, 
                      validator => validator
                                          .ForEach(m => m.CreditCards, validateCreditCardRules)
                                  .ToResult())
        .If(m => m.Password != '', validator => 
                                        validator.For(m => m.Password, passwordValidator =>
                                                                          passwordValidator.Matches("(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])", "Password strength is not valid")
                                                                                           .Required((m, pwd) => pwd.length > 3, "Password length should be greater than 3")
                                                                                           .Required((m, pwd) => !m.PreviousPasswords.some(prevPwd => prevPwd == pwd), "Password is already used")
                                                                      .ToResult())
                                        .ToResult())                                                                                                                    
    .ToResult();
 };

 var validateAccountantRules = (validator: IValidator<Accountant>) : ValidationResult => {
  return validator
            .NotEmpty(m => m.Code, "Should not be empty")
        .ToResult();
};

describe('Validator Tests', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    
  });

  it('Employee should have no validation errors - Sync', () => {
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

    var validationResult = new Validator(model).Validate(validateEmployeeRules); 
    
    expect(validationResult.IsValid).toBeTruthy();    
  });

  it('StringAPITest should have no validation errors - Sync', () => {
    var model = new StringAPITest();
    
    model.IsLowercase = "ayb";
    model.IsUppercase = "AHY";
    model.IsMixedcase = "arT";
    model.IsGuid = "7e070f9a-e46c-4657-b12f-8e50a9a1429f";
    model.IsBase64 = "VGhpcyBpcyBhIHRlc3Q=";
    model.IsUrl = "https://nortonsafe.search.ask.com/web?q=javascript+url+regex&o=APN11908&chn=32430&guid=A1D1CC2B-4476-4247-AC22-F1695C86CC52&doi=2018-03-03&ver=22.10.0.85&prt=NSBU&geo=AU&locale=en_AU&trackId=direct";
    model.IsNumeric = "456";
    model.IsAlpha = "aZ";
    model.IsAlphaNumeric = "aB9";
    model.Contains = "For test purpose";

    var validationResult = new Validator(model).Validate(validateStringAPITest); 
    
    expect(validationResult.IsValid).toBeTruthy();    
  });

  it('StringAPITestProperty should have no validation errors - Sync', () => {
    var model = new StringAPITestProperty();

    model.StringAPITest = new StringAPITest();
    
    model.StringAPITest.IsLowercase = "ayb";
    model.StringAPITest.IsUppercase = "AHY";
    model.StringAPITest.IsMixedcase = "arT";
    model.StringAPITest.IsGuid = "7e070f9a-e46c-4657-b12f-8e50a9a1429f";
    model.StringAPITest.IsBase64 = "VGhpcyBpcyBhIHRlc3Q=";
    model.StringAPITest.IsUrl = "https://nortonsafe.search.ask.com/web?q=javascript+url+regex&o=APN11908&chn=32430&guid=A1D1CC2B-4476-4247-AC22-F1695C86CC52&doi=2018-03-03&ver=22.10.0.85&prt=NSBU&geo=AU&locale=en_AU&trackId=direct";
    model.StringAPITest.IsNumeric = "456";
    model.StringAPITest.IsAlpha = "aZ";
    model.StringAPITest.IsAlphaNumeric = "aB9";
    model.StringAPITest.Contains = "For test purpose";

    var validationResult = new Validator(model).Validate(validateStringAPITestProperty); 
    
    expect(validationResult.IsValid).toBeTruthy();    
  });  

  it('Accountant should have no validation errors - Sync', () => {    
    var accountant = new Accountant();
    accountant.Code = "ACC001";
    accountant.Name = "John Doe";

    accountant.Password = "sD4A3";
    accountant.PreviousPasswords = new Array<string>()     
    accountant.PreviousPasswords.push("sD4A");
    accountant.PreviousPasswords.push("sD4A1");
    accountant.PreviousPasswords.push("sD4A2");

    accountant.CreditCards = new Array<CreditCard>();
    var masterCard = new CreditCard();
    masterCard.Number = 5105105105105100;
    masterCard.Name = "John Doe"
    var amexCard = new CreditCard();
    amexCard.Number = 371449635398431;
    amexCard.Name = "John Doe"
    accountant.CreditCards.push(masterCard);
    accountant.CreditCards.push(amexCard);

    accountant.Super = new Super();
    accountant.Super.Name = "XYZ Super Fund";
    accountant.Super.Code = "XY1234";

    accountant.Email = "john.doe@xyx.com";

    var validationResult = new Validator(accountant).ValidateBase(validateEmployeeRules)
                                                    .Validate(validateAccountantRules); 
    
    expect(validationResult.IsValid).toBeTruthy();
  });

  it('Employee should have no validation errors - Async', async () => {
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

    var validationResult = await new Validator(model).ValidateAsync(validateEmployeeRules); 
    
    expect(validationResult.IsValid).toBeTruthy();        
  });

  it('Accountant should have no validation errors - Async', async () => {    
    var accountant = new Accountant();
    accountant.Code = "ACC001";
    accountant.Name = "John Doe";

    accountant.Password = "sD4A3";
    accountant.PreviousPasswords = new Array<string>()     
    accountant.PreviousPasswords.push("sD4A");
    accountant.PreviousPasswords.push("sD4A1");
    accountant.PreviousPasswords.push("sD4A2");

    accountant.CreditCards = new Array<CreditCard>();
    var masterCard = new CreditCard();
    masterCard.Number = 5105105105105100;
    masterCard.Name = "John Doe"
    var amexCard = new CreditCard();
    amexCard.Number = 371449635398431;
    amexCard.Name = "John Doe"
    accountant.CreditCards.push(masterCard);
    accountant.CreditCards.push(amexCard);

    accountant.Super = new Super();
    accountant.Super.Name = "XYZ Super Fund";
    accountant.Super.Code = "XY1234";

    accountant.Email = "john.doe@xyx.com";

    var validationResult = await new Validator(accountant).ValidateBaseAsync(validateEmployeeRules)
                                                          .ValidateAsync(validateAccountantRules); 
    
    expect(validationResult.IsValid).toBeTruthy();
  });

  it('Accountant should have 1 validation error from Accountant model - Async', async () => {    
    var accountant = new Accountant();
    accountant.Code = "";
    accountant.Name = "John Doe";

    accountant.Password = "sD4A3";
    accountant.PreviousPasswords = new Array<string>()     
    accountant.PreviousPasswords.push("sD4A");
    accountant.PreviousPasswords.push("sD4A1");
    accountant.PreviousPasswords.push("sD4A2");

    accountant.CreditCards = new Array<CreditCard>();
    var masterCard = new CreditCard();
    masterCard.Number = 5105105105105100;
    masterCard.Name = "John Doe"
    var amexCard = new CreditCard();
    amexCard.Number = 371449635398431;
    amexCard.Name = "John Doe"
    accountant.CreditCards.push(masterCard);
    accountant.CreditCards.push(amexCard);

    accountant.Super = new Super();
    accountant.Super.Name = "XYZ Super Fund";
    accountant.Super.Code = "XY1234";

    accountant.Email = "john.doe@xyx.com";

    var validationResult = await new Validator(accountant).ValidateBaseAsync(validateEmployeeRules)
                                                          .ValidateAsync(validateAccountantRules); 
    
    expect(validationResult.IsValid).toBeFalsy();
    expect(validationResult.Errors.length == 1).toBeTruthy();

    expect(validationResult.Errors[0].Value == "").toBeTruthy();
    expect(validationResult.Errors[0].Identifier == "Code").toBeTruthy();
    expect(validationResult.Errors[0].Message == "Should not be empty").toBeTruthy();
  });

  it('Accountant should have 1 validation error from base Employee model - Async', async () => {    
    var accountant = new Accountant();
    accountant.Code = "ACC001";
    accountant.Name = "John Doe";

    accountant.Password = "sD4A3";
    accountant.PreviousPasswords = new Array<string>()     
    accountant.PreviousPasswords.push("sD4A");
    accountant.PreviousPasswords.push("sD4A1");
    accountant.PreviousPasswords.push("sD4A2");

    accountant.CreditCards = new Array<CreditCard>();
    var masterCard = new CreditCard();
    masterCard.Number = 5105105105105100;
    masterCard.Name = "John Doe"
    var amexCard = new CreditCard();
    amexCard.Number = 371449635398431;
    amexCard.Name = "John Doe"
    accountant.CreditCards.push(masterCard);
    accountant.CreditCards.push(amexCard);

    accountant.Super = new Super();
    accountant.Super.Name = "XYZ Super Fund";
    accountant.Super.Code = "XY1234";

    accountant.Email = "john.doexyx.com";

    var validationResult = await new Validator(accountant).ValidateBaseAsync(validateEmployeeRules)
                                                          .ValidateAsync(validateAccountantRules); 
    
    expect(validationResult.IsValid).toBeFalsy();
    expect(validationResult.Errors.length == 1).toBeTruthy();

    expect(validationResult.Errors[0].Value == "john.doexyx.com").toBeTruthy();
    expect(validationResult.Errors[0].Identifier == "Employee.Email.Invalid").toBeTruthy();
    expect(validationResult.Errors[0].Message == "Should not be invalid").toBeTruthy();
  }); 
  
  it('Accountant should have 1 validation error from base Employee model and 1 error from Accountant model - Async', async () => {    
    var accountant = new Accountant();
    accountant.Code = "";
    accountant.Name = "John Doe";

    accountant.Password = "sD4A3";
    accountant.PreviousPasswords = new Array<string>()     
    accountant.PreviousPasswords.push("sD4A");
    accountant.PreviousPasswords.push("sD4A1");
    accountant.PreviousPasswords.push("sD4A2");

    accountant.CreditCards = new Array<CreditCard>();
    var masterCard = new CreditCard();
    masterCard.Number = 5105105105105100;
    masterCard.Name = "John Doe"
    var amexCard = new CreditCard();
    amexCard.Number = 371449635398431;
    amexCard.Name = "John Doe"
    accountant.CreditCards.push(masterCard);
    accountant.CreditCards.push(amexCard);

    accountant.Super = new Super();
    accountant.Super.Name = "XYZ Super Fund";
    accountant.Super.Code = "XY1234";

    accountant.Email = "john.doexyx.com";

    var validationResult = await new Validator(accountant).ValidateBaseAsync(validateEmployeeRules)
                                                          .ValidateAsync(validateAccountantRules); 
    
    expect(validationResult.IsValid).toBeFalsy();
    expect(validationResult.Errors.length == 2).toBeTruthy();    

    //Error from base Employee model
    expect(validationResult.Errors[0].Value == "john.doexyx.com").toBeTruthy();
    expect(validationResult.Errors[0].Identifier == "Employee.Email.Invalid").toBeTruthy();
    expect(validationResult.Errors[0].Message == "Should not be invalid").toBeTruthy();
    //Error from Accountant model
    expect(validationResult.Errors[1].Value == "").toBeTruthy();
    expect(validationResult.Errors[1].Identifier == "Code").toBeTruthy();
    expect(validationResult.Errors[1].Message == "Should not be empty").toBeTruthy();
  }); 
});
