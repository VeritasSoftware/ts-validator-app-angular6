export class User
{
  Id : string;
  Pwd : string;

  constructor(id: string, pwd: string){
    this.Id = id;
    this.Pwd = pwd;
  }
}

export class RegisterUser
{
  Name: string;
  CreditCardNo : string;
  Id: string;
  Email: string;
  Password: string;
  ConfirmPassword: string;
  IsParentalSupervisionProvided: boolean;
  AgeGroup: AgeGroupEnum;

  constructor(name: string, creditCardNo: string, id: string, pwd: string, confirmPwd: string, email: string, ageGroup: AgeGroupEnum, isParentalSupervisionProvided: boolean){
    this.Name = name;
    this.CreditCardNo = creditCardNo;    
    this.Id = id;
    this.Password = pwd;
    this.ConfirmPassword = confirmPwd;
    this.Email = email; 
    this.AgeGroup = ageGroup; 
    this.IsParentalSupervisionProvided = isParentalSupervisionProvided;   
  }
}

export class AgeGroup
{
  Val: AgeGroupEnum;
  Text: string;

  constructor(val: AgeGroupEnum, text: string){
    this.Val = val;
    this.Text = text;
  }
}

export enum AgeGroupEnum
{
  None = 0,
  Adult = 1,
  Minor = 2  
}