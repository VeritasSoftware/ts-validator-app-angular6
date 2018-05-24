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

  constructor(name: string, creditCardNo: string, id: string, pwd: string, confirmPwd: string, email: string){
    this.Name = name;
    this.CreditCardNo = creditCardNo;    
    this.Id = id;
    this.Password = pwd;
    this.ConfirmPassword = confirmPwd;
    this.Email = email;
  }
}