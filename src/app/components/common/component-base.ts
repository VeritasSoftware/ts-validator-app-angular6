import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Injector } from '@angular/core';
import {NgbTooltip, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';

import { ObjectValidator, ValidationError, ValidationResult } from '../../core/validate';
import { ValidationService } from '../../services/validation-service';

/****************************/
/* Base component interface */
/****************************/
export interface IComponentBase {
    toggleValidateMe(item: string, set: boolean);
    IsValid(item: string, service:(validationService: ValidationService) => Promise<ValidationResult>) : Promise<boolean>;
    showValidationTooltip(error: string, tooltip: NgbTooltip): void;
    validateForm(service:(validationService: ValidationService) => Promise<ValidationResult>) : Promise<void>
}
  
/************************/
/* Base component class */
/************************/
export abstract class ComponentBase implements IComponentBase {
    protected validationResult: ValidationResult = null;
    validationService: ValidationService;
    config: NgbTooltipConfig;

    constructor(@Inject(DOCUMENT) document) {
        const injector = Injector.create({providers: [{provide: NgbTooltipConfig, deps: []}]});
        const injector1 = Injector.create({providers: [{provide: ValidationService, deps: []}]});
        
        this.config = injector.get(NgbTooltipConfig);
        this.validationService = injector1.get(ValidationService);

        this.config.placement = 'top';
        this.config.triggers = 'manual';
    }

    toggleValidateMe(p: string, set: boolean) {
        var element = document.getElementById(p);
        if (set) {      
            element.classList.remove("validation-success");
            element.classList.add("validation-failure");
        }
        else
        {
            element.classList.remove("validation-failure");
            element.classList.add("validation-success");
        }
    }

    async IsValid(item: string, service:(validationService: ValidationService) => Promise<ValidationResult>) : Promise<boolean> {
        this.validationResult = await service(this.validationService);    
        var errors = this.validationResult.IdentifierStartsWith(item);    
        this.toggleValidateMe(item, errors.length > 0);
        return !(errors != null && errors.length > 0);     
    }

    showValidationTooltip(error: string, tooltip: NgbTooltip): void {    
        tooltip.close();
        var errors = this.validationResult.IdentifierStartsWith(error);
        this.toggleValidateMe(error, errors.length > 0);
        if (errors != null && errors.length > 0) {
            setTimeout(()=> tooltip.open());    
        }    
    }

    async validateForm(service:(validationService: ValidationService) => Promise<ValidationResult>) : Promise<void> {
        this.validationResult = await service(this.validationService);
        
        this.validationResult.IsValid ?
            alert("Congrats! Validation passed.") :
            this.showValidationTooltips();   
    }

    public showValidationTooltips() {

    } 
}