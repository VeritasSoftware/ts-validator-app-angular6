import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { ValidationService } from '../../services/validation-service';
import { User } from '../../models';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let ngbTooltipConfig: NgbTooltipConfig;
  let validationService: ValidationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [FormsModule, NgbModule.forRoot()],
      providers: [NgbTooltipConfig, ValidationService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    ngbTooltipConfig = TestBed.get(NgbTooltipConfig);
    validationService = TestBed.get(ValidationService);                        
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });  

  it('should create', () => {
    expect(component).toBeTruthy();    
  }); 
  
  it('validateForm is false', async () => {
    expect(component).toBeTruthy();
    component.loginUser = new User("", "");
    await component.validateFormAsync();
    expect(component.validationResult.IsValid).toBeFalsy();
  }); 

  it('validateForm is true', async () => {
    expect(component).toBeTruthy();
    component.loginUser = new User("xyz", "abc");
    await component.validateFormAsync();
    expect(component.validationResult.IsValid).toBeTruthy();
  }); 
});
