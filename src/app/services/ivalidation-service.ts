import { User, RegisterUser } from '../models/models.component'
import { ValidationResult } from '../core/validate';

export interface IValidationService {
    validateUser(model: User) : ValidationResult;
    validateRegisterUser(model: RegisterUser) : ValidationResult;
}