import { User, RegisterUser } from '../models/models.component'
import { ValidationResult } from '../core/validate';

export interface IValidationService {
    validateUser(model: User) : ValidationResult;
    validateUserAsync(model: User) : Promise<ValidationResult>;
    validateRegisterUser(model: RegisterUser) : ValidationResult;
    validateRegisterUserAsync(model: RegisterUser) : Promise<ValidationResult>;
}