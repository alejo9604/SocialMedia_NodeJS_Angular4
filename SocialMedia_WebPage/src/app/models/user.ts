
export class User{

  public id:number;
  public name:string;
  public username:string;
  public password:string;
  public email:string;
  public avatar:string;
  public type:number;

  public old_type:number;

  constructor(name:string, username:string, password:string, email:string, avatar:string = "assets/img/profile.png"){
    this.name = name;
    this.username = username;
    this.password = password;
    this.email = email;
    this.avatar = avatar;
  }

}
