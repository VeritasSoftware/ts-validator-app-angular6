import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationService } from './validation-service';
import { ValidationResult } from '../core/validate/validation-result';
import { User, RegisterUser } from '../models/models.component';

describe('Validation Service Tests', () => {
    let validationService: ValidationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [ValidationService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    
  });

  it('User should have 2 validation errors - Async', async () => {
    var model = new User("", "");
    
    //Inject Validation Service
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
  
  it('User should have no validation errors - Async', async () => {
    var model = new User("xyz", "abc");
    
    //Inject Validation Service
    validationService = TestBed.get(ValidationService);

    var validationResult = await validationService.validateUserAsync(model);
    
    expect(validationResult.IsValid).toBeTruthy();
    expect(validationResult.Errors.length == 0).toBeTruthy();    
  }); 
});