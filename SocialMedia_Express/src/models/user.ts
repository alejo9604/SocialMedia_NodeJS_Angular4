import { Person  } from "./person";
import * as bcrypt from "bcrypt-nodejs";

/**
* / models
*
* @class User
*/

export class User extends Person{

  private _username:string;
  private _password:string;
  private _email:string;
  private _avatar_path:string;
  private _type:number;

  static passRE = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$"); //(?=\S+$)
  static emailRE = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$");

  constructor( id:number, name:string, username:string, password:string, email:string, avatar_path:string, type:number){
    super(id, name);
      this.username = username;
      this.password = password;
      this.email = email;
      this.avatar_path = avatar_path;
      this._type = type;
  }


  /*
    Getters & Setters
  */
  get username():string{
    return this._username;
  }
  set username( username:string ){
    this.validateEmpty(username);
    this._username = username;
  }

  get password():string{
    return this._password;
  }
  set password( password:string){
    this.validateEmpty(password);
    /*
    if(!this.passRE.test(password) ){
        throw Error ("Error data security!");
    }
    */
    this._password = password;
  }

  get email():string{
    return this._email;
  }
  set email( email:string ){
    this.validateEmpty(email);
    if( !User.emailRE.test(email) ){
      throw Error ("Error data security!");
    }
    this._email = email;
  }

  get avatar_path():string{
    return this._avatar_path;
  }
  set avatar_path( avatar_path:string ){
    //this.validateEmpty(avatar_path);
    this._avatar_path = avatar_path;
  }

  get type():number{
    return this._type;
  }
  set type( type:number ){
    //this.validateEmpty(avatar_path);
    this._type = type;
  }



  comparePassword = function (passw:string, callback: (match: boolean, err) => void ) {

      bcrypt.compare(passw, this.password, function (err, isMatch) {

          if (err) {
              return callback(null, err);
          }
          callback(isMatch, null);
      });
  };

  static testPassword(passw:string):boolean{
    if(User.passRE.test(passw) ){
      return true;
    }
    return false;
  }

  static hashPassword(passw:string, callback: (hash: string, err) => void ){
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        console.log(err);
        return callback(null, {erro: 'bcrypt salt'});
      }
      bcrypt.hash(passw, salt, null, function (err, hash) {
          if (err) {
            console.log(err);
            callback(null, {erro: 'bcrypt hash'});
          }else{
            callback(hash, null);
          }
      });
    });
  }

}
