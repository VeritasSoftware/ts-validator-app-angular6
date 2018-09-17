import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Injector } from '@angular/core';
import { NgbTooltip, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

import { ValidationResult } from '../../core/validate';
import { ValidationService } from '../../services/validation-service';

/****************************/
/* Base component interface */
/****************************/
export interface IComponentBase {
    toggleValidateMe(item: string, set: boolean);
    IsValid(item: string, service:(validationService: ValidationService) => ValidationResult) : boolean;
    showValidationTooltip(error: string, tooltip: NgbTooltip): void;
    validateFormAsync(service:(validationService: ValidationService) => Promise<ValidationResult>) : Promise<boolean>;
}
  
/************************/
/* Base component class */
/************************/
export abstract class ComponentBase implements IComponentBase {
    public validationResult: ValidationResult = null;
    
    protected validationAsyncDelegate: (validationService: ValidationService) => Promise<ValidationResult>;
    protected validationSyncDelegate: (validationService: ValidationService) => ValidationResult;    

    validationService: ValidationService;

    constructor(@Inject(DOCUMENT) document, config: NgbTooltipConfig) {
        const injector = Injector.create({providers: [{provide: ValidationService, deps: []}]});
        
        this.validationService = injector.get(ValidationService);

        config.placement = 'top';
        config.triggers = 'manual';
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

    IsValid(item: string, service:(validationService: ValidationService) => ValidationResult) : boolean {
        this.validationResult = service(this.validationService);    
        var errors = this.validationResult.IdentifierStartsWith(item);    
        this.toggleValidateMe(item, errors.length > 0);
        return !(errors != null && errors.length > 0);     
    }

    showValidationTooltip(error: string, tooltip: NgbTooltip): void {
        if (tooltip != null) {
            tooltip.close();
            var errors = this.validationResult.IdentifierStartsWith(error);
            this.toggleValidateMe(error, errors.length > 0);
            if (errors != null && errors.length > 0) {
                setTimeout(()=> tooltip.open());    
            }   
        }             
    }

    async validateFormAsync(service:(validationService: ValidationService) => Promise<ValidationResult>) : Promise<boolean> {
        this.validationResult = await service(this.validationService);
        
        this.validationResult.IsValid ?
            alert("Congrats! Validation passed.") :
            this.showValidationTooltips();
            
        return this.validationResult.IsValid;
    }

    /* Method to be overridden in derived class */
    public showValidationTooltips() : void {

    } 
}