import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { RegisterComponent } from './register.component';
import { ValidationService } from '../../services/validation-service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let ngbTooltipConfig: NgbTooltipConfig;
  let validationService: ValidationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports: [FormsModule, NgbModule.forRoot(),],
      providers: [NgbTooltipConfig, ValidationService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    ngbTooltipConfig = TestBed.get(NgbTooltipConfig);
    validationService = TestBed.get(ValidationService);
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
