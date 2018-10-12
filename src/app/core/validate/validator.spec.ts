import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { IValidator } from './ivalidator';
// import { Validator } from './validator';
// import { ValidationResult } from './validation-result';

import { IValidator, Validator, ValidationResult } from '../../../../../ts.validator/dist';
//import { IValidator, Validator, ValidationResult } from 'ts.validator.fluent/dist';

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
   ExpiryDate: Date;
 }
 
 class Super {
    Name: string;
    Code: string;
 }

 class StringRulesTest {
   IsLowercase: string;
   IsUppercase: string;
   IsMixedcase: string;
   IsGuid: string;
   IsBase64: string;
   IsUrl: string;
   IsCountryCode: string;
   IsNumeric: string;
   IsAlpha: string;
   IsAlphaNumeric: string;
   Contains: string;
 }

 class DateRulesTest {
   IsDateAfter: Date;
   IsDateOnOrAfter: Date;
   IsDateBefore: Date;
   IsDateOnOrBefore: Date;
   IsDateBetweenInclusive: Date;
   IsDateBetweenExclusive: Date;
   IsDateLeapYear: Date
 }

 class NumberRulesTest {
    IsNumberEqual: Number;
    IsNumberNotEqual: Number;
    IsNumberLessThan: Number;
    IsNumberLessThanOrEqual: Number;
    IsNumberGreaterThan: Number;
    IsNumberGreaterThanOrEqual: Number;
    
    IsNumberEqualProperty: Number;
    IsNumberNotEqualProperty: Number;
    IsNumberLessThanProperty: Number;
    IsNumberLessThanOrEqualProperty: Number;
    IsNumberGreaterThanProperty: Number;
    IsNumberGreaterThanOrEqualProperty: Number;

    CreditCardProperty: Number;

    RequiredProperty: Number;
}

 class StringRulesTestProperty {
  StringRulesTest: StringRulesTest;
 }  

 var validateNumberRulesTest = (validator: IValidator<NumberRulesTest>) : ValidationResult => {
   return validator
              .IsNumberEqual(m => m.IsNumberEqual, 1, "Should be equal")
              .IsNumberNotEqual(m => m.IsNumberNotEqual, 1, "Should be equal")
              .IsNumberLessThan(m => m.IsNumberLessThan,1, "Should be less than")
              .IsNumberLessThanOrEqual(m => m.IsNumberLessThanOrEqual,1, "Should be less than or equal to")
              .IsNumberGreaterThan(m => m.IsNumberGreaterThan,1, "Should be greater than")
              .IsNumberGreaterThanOrEqual(m => m.IsNumberGreaterThanOrEqual,1, "Should be greater than to equal to")
              .ForNumberProperty(m => m.IsNumberEqualProperty, validator => validator
                                                                          .IsNumberEqual(1, "Should be equal")
                                                                    .ToResult()) 
              .ForNumberProperty(m => m.IsNumberNotEqualProperty, validator => validator
                                                                          .IsNumberNotEqual(1, "Should not be equal")
                                                                    .ToResult())                                                                    
              .ForNumberProperty(m => m.IsNumberLessThanProperty, validator => validator
                                                                          .IsNumberLessThan(1, "Should be less than")
                                                                    .ToResult())
              .ForNumberProperty(m => m.IsNumberLessThanOrEqualProperty, validator => validator
                                                                          .IsNumberLessThanOrEqual(1, "Should be less than or equal")
                                                                    .ToResult())
              .ForNumberProperty(m => m.IsNumberGreaterThanProperty, validator => validator
                                                                          .IsNumberGreaterThan(1, "Should be greater than")
                                                                    .ToResult())                                                                    
              .ForNumberProperty(m => m.IsNumberGreaterThanOrEqualProperty, validator => validator
                                                                          .IsNumberGreaterThanOrEqual(1, "Should be greater than or equal")
                                                                    .ToResult())
              .ForNumberProperty(m => m.CreditCardProperty, validator => validator
                                                                          .CreditCard("Should be valid credit card no")
                                                                    .ToResult())
              .ForNumberProperty(m => m.RequiredProperty, validator => validator
                                                                          .Required((m, r) => r == 1, "Should be valid credit card no")
                                                                    .ToResult())
        .ToResult();
 };

 var validateStringRulesTest = (validator: IValidator<StringRulesTest>) : ValidationResult => {
  return validator
            .IsLowercase(m => m.IsLowercase, "Should be lower case")
            .IsUppercase(m => m.IsUppercase, "Should be upper case")
            .IsMixedcase(m => m.IsMixedcase, "Should be mixed case")
            .IsGuid(m => m.IsGuid, "Should be guid/uuid")
            .IsBase64(m => m.IsBase64, "Should be base64")
            .IsUrl(m => m.IsUrl, "Should be url")
            .IsCountryCode(m => m.IsCountryCode, "Should be country code")
            .IsNumeric(m => m.IsNumeric, "Should be numeric")
            .IsAlpha(m => m.IsAlpha, "Should be alpha")
            .IsAlphaNumeric(m => m.IsAlphaNumeric, "Should be alpha numeric")
            .Contains(m => m.Contains, "test", "Should contain test") 
        .ToResult();
 };

 var validateStringRulesTestProperty = (validator: IValidator<StringRulesTestProperty>) : ValidationResult => {
   return validator
                .ForType(m => m.StringRulesTest, validateStringRulesTest)
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

 var today = new Date();

 var validateCreditCardRules =  (validator: IValidator<CreditCard>) : ValidationResult => {  
  return validator
            .NotNull(m => m.Name, "Should not be null", "CreditCard.Name.Null")
            .NotNull(m => m.Number, "Should not be null", "CreditCard.Number.Null")
            .NotNull(m => m.ExpiryDate, "Should not be null", "CreditCard.ExpiryDate.Null")
            .If(m => m.Name != null && m.Number > 0 && m.ExpiryDate != null, validator => validator 
                                                          .NotEmpty(m => m.Name, "Should not be empty", "CreditCard.Name.Empty")
                                                          .CreditCard(m => m.Number, "Should not be invalid", "CreditCard.Number.Invalid")
                                                          .IsDateOnOrAfter(m => m.ExpiryDate, new Date(), "Should be on or after today's date", "CreditCard.ExpiryDate.Invalid")
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
          .Required(m => m.CreditCards, (m, creditCards) => creditCards.length > 0, "Must have atleast 1 credit card", "Employee.CreditCards.Required")
          .If(m => m.CreditCards != null && m.CreditCards.length > 0, 
                      validator => validator
                                          .ForEach(m => m.CreditCards, validateCreditCardRules)
                                  .ToResult())
          .If(m => m.Password != '', validator => validator
                                          .ForStringProperty(m => m.Password, passwordValidator => passwordValidator
                                                  .Matches("(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])", "Password strength is not valid", "Employee.Password.Strength")
                                                  .Required((m, pwd) => pwd.length > 3, "Password length should be greater than 3", "Employee.Password.Length")
                                                  .Required((m, pwd) => !m.PreviousPasswords.some(prevPwd => prevPwd == pwd), "Password is already used", "Employee.Password.AlreadyUsed")
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

    var expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate());


    model.CreditCards = new Array<CreditCard>();
    var masterCard = new CreditCard();
    masterCard.Number = 5105105105105100;
    masterCard.Name = "John Doe"
    masterCard.ExpiryDate = expiryDate;
    var amexCard = new CreditCard();
    amexCard.Number = 371449635398431;
    amexCard.Name = "John Doe"
    amexCard.ExpiryDate = expiryDate;
    model.CreditCards.push(masterCard);
    model.CreditCards.push(amexCard);

    model.Super = new Super();
    model.Super.Name = "XYZ Super Fund";
    model.Super.Code = "XY1234";

    model.Email = "john.doe@xyx.com";

    var validationResult = new Validator(model).Validate(validateEmployeeRules); 
    
    expect(validationResult.IsValid).toBeTruthy();    
  });

  it('StringRulesTest should have no validation errors - Sync', () => {
    var model = new StringRulesTest();
    
    model.IsLowercase = "ayb";
    model.IsUppercase = "AHY";
    model.IsMixedcase = "arT";
    model.IsGuid = "7e070f9a-e46c-4657-b12f-8e50a9a1429f";
    model.IsBase64 = "VGhpcyBpcyBhIHRlc3Q=";
    model.IsUrl = "https://nortonsafe.search.ask.com/web?chn=32430&cmpgn=&doi=2018-03-03&geo=AU&guid=A1D1CC2B-4476-4247-AC22-F1695C86CC52&locale=en_AU&o=APN11908&p2=%5EET%5Ecd20au%5Edirect&prt=NSBU&trackId=direct&ver=22.10.0.85&tpr=2&enc=2&q=PVEBDevK0oZq4h-WvUP1_kRpuMFkYmfb60viD1qkqjYFCVU3oPcBSgbbFhTZI3N3qFNptWm6p8q-uCzQ5qr4zlZpT6qq5JI0oSoAwg152MgBxAXu8KKMG6hZZGq-r1bmGWiB0o1qSokuyiBrpdBqM5H2Cxf0B56PXqc7I2MDU4Ksb648wAzLsHiiCjRKZgcMiQKjpS52xFvKP3YqnhDP6ecN-Y9rJp6sBx4spoNjQFaaOvzwHItON7JIoRI_SJn3ZnIVft8tDiTMNVf9DK0L937HhHm_TQWNFWnCrwVKembBx1nvQVQUHXd7-h5K1KBBgRUBF3d4AInt0zx2-3h_fA&ts=1537580232048";
    model.IsCountryCode = "AU";
    model.IsNumeric = "456";
    model.IsAlpha = "aZ";
    model.IsAlphaNumeric = "aB9";
    model.Contains = "For test purpose";

    var validationResult = new Validator(model).Validate(validateStringRulesTest); 
    
    expect(validationResult.IsValid).toBeTruthy();    
  });

  it('NumberRulesTest should have no validation errors - Sync', () => {
    var model = new NumberRulesTest();
    
    model.IsNumberEqual = 1;
    model.IsNumberNotEqual = 0;
    model.IsNumberLessThan = 0;
    model.IsNumberLessThanOrEqual = 1;
    model.IsNumberGreaterThan = 2;
    model.IsNumberGreaterThanOrEqual = 1;
    
    model.IsNumberEqualProperty = 1;
    model.IsNumberNotEqualProperty = 2;
    model.IsNumberLessThanProperty = 0;
    model.IsNumberLessThanOrEqualProperty = 1;
    model.IsNumberGreaterThanProperty = 2;
    model.IsNumberGreaterThanOrEqualProperty = 1;

    model.CreditCardProperty = 371449635398431;
    model.RequiredProperty = 1;

    var validationResult = new Validator(model).Validate(validateNumberRulesTest); 
    
    expect(validationResult.IsValid).toBeTruthy();    
  });

  it('StringRulesTestProperty should have no validation errors - Sync', () => {
    var model = new StringRulesTestProperty();

    model.StringRulesTest = new StringRulesTest();
    
    model.StringRulesTest.IsLowercase = "ayb";
    model.StringRulesTest.IsUppercase = "AHY";
    model.StringRulesTest.IsMixedcase = "arT";
    model.StringRulesTest.IsGuid = "7e070f9a-e46c-4657-b12f-8e50a9a1429f";
    model.StringRulesTest.IsBase64 = "VGhpcyBpcyBhIHRlc3Q=";
    model.StringRulesTest.IsUrl = "https://nortonsafe.search.ask.com/web?chn=32430&cmpgn=&doi=2018-03-03&geo=AU&guid=A1D1CC2B-4476-4247-AC22-F1695C86CC52&locale=en_AU&o=APN11908&p2=%5EET%5Ecd20au%5Edirect&prt=NSBU&trackId=direct&ver=22.10.0.85&tpr=2&enc=2&q=PVEBDevK0oZq4h-WvUP1_kRpuMFkYmfb60viD1qkqjYFCVU3oPcBSgbbFhTZI3N3qFNptWm6p8q-uCzQ5qr4zlZpT6qq5JI0oSoAwg152MgBxAXu8KKMG6hZZGq-r1bmGWiB0o1qSokuyiBrpdBqM5H2Cxf0B56PXqc7I2MDU4Ksb648wAzLsHiiCjRKZgcMiQKjpS52xFvKP3YqnhDP6ecN-Y9rJp6sBx4spoNjQFaaOvzwHItON7JIoRI_SJn3ZnIVft8tDiTMNVf9DK0L937HhHm_TQWNFWnCrwVKembBx1nvQVQUHXd7-h5K1KBBgRUBF3d4AInt0zx2-3h_fA&ts=1537580232048";
    model.StringRulesTest.IsCountryCode = "AU";
    model.StringRulesTest.IsNumeric = "456";
    model.StringRulesTest.IsAlpha = "aZ";
    model.StringRulesTest.IsAlphaNumeric = "aB9";
    model.StringRulesTest.Contains = "For test purpose";

    var validationResult = new Validator(model).Validate(validateStringRulesTestProperty); 
    
    expect(validationResult.IsValid).toBeTruthy();    
  });  

  it('Accountant should have no validation errors - Sync', () => {    
    var accountant = new Accountant();
    accountant.Code = "ACC001";

    //Employee data
    accountant.Name = "John Doe";

    accountant.Password = "sD4A3";
    accountant.PreviousPasswords = new Array<string>()     
    accountant.PreviousPasswords.push("sD4A");
    accountant.PreviousPasswords.push("sD4A1");
    accountant.PreviousPasswords.push("sD4A2");

    var expiryDate = new Date();

    accountant.CreditCards = new Array<CreditCard>();
    var masterCard = new CreditCard();
    masterCard.Number = 5105105105105100;
    masterCard.Name = "John Doe"
    masterCard.ExpiryDate = expiryDate;
    var amexCard = new CreditCard();
    amexCard.Number = 371449635398431;
    amexCard.Name = "John Doe";
    amexCard.ExpiryDate = expiryDate;
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

    var date = new Date();
    date.setDate(date.getDate());

    model.CreditCards = new Array<CreditCard>();
    var masterCard = new CreditCard();
    masterCard.Number = 5105105105105100;
    masterCard.Name = "John Doe";
    masterCard.ExpiryDate = date;
    var amexCard = new CreditCard();
    amexCard.Number = 371449635398431;
    amexCard.Name = "John Doe";
    amexCard.ExpiryDate = date;
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

    var date = new Date();
    date.setDate(date.getDate());

    accountant.CreditCards = new Array<CreditCard>();
    var masterCard = new CreditCard();
    masterCard.Number = 5105105105105100;
    masterCard.Name = "John Doe";
    masterCard.ExpiryDate = date;
    var amexCard = new CreditCard();
    amexCard.Number = 371449635398431;
    amexCard.Name = "John Doe";
    amexCard.ExpiryDate = date;
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

    var date = new Date();
    date.setDate(date.getDate());

    accountant.CreditCards = new Array<CreditCard>();
    var masterCard = new CreditCard();
    masterCard.Number = 5105105105105100;
    masterCard.Name = "John Doe";
    masterCard.ExpiryDate = date;
    var amexCard = new CreditCard();
    amexCard.Number = 371449635398431;
    amexCard.Name = "John Doe";
    amexCard.ExpiryDate = date;
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

    var date = new Date();
    date.setDate(date.getDate());

    accountant.CreditCards = new Array<CreditCard>();
    var masterCard = new CreditCard();
    masterCard.Number = 5105105105105100;
    masterCard.Name = "John Doe";
    masterCard.ExpiryDate = date;
    var amexCard = new CreditCard();
    amexCard.Number = 371449635398431;
    amexCard.Name = "John Doe";
    amexCard.ExpiryDate = date;
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

    var date = new Date();
    date.setDate(date.getDate());

    accountant.CreditCards = new Array<CreditCard>();
    var masterCard = new CreditCard();
    masterCard.Number = 5105105105105100;
    masterCard.Name = "John Doe";
    masterCard.ExpiryDate = date;
    var amexCard = new CreditCard();
    amexCard.Number = 371449635398431;
    amexCard.Name = "John Doe";
    amexCard.ExpiryDate = date;
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
