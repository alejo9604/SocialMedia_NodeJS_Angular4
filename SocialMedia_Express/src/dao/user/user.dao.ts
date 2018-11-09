import * as mysql from "mysql";
import { User } from "../../models/user";

/**
* / doa / album
*
* @class UserDAO
*         Abstract class for User - DB control
*/

export abstract class UserDAO{

  private connection:mysql;

  constructor(connection:mysql){
  this.connection= connection;
  }

  public getConnection(){
    return this.connection;
  }

  //Get All User
  public abstract  all(callback: (data: User[], err) => void);

  //Get User by username
  public abstract findOne(username:string, callback: (data:User, err) => void) :void;

  //Get User by id
  public abstract findOneById(userId:number, callback: (data:User, err) => void) :void;

  //Insert
  public abstract Insert(name:string, username:string, password:string, email:string, avatar_path:string, callback: (user: User, err) => void):void;

  //Check if can edit type other users
  public abstract CanSeePhotos(id:number, callback: (can: boolean, err) => void ):void;

  //Check if two user has the same type
  public abstract isSameType(id1:number, id2:number, callback: (can: boolean, err) => void ):void;

  //Check if can edit type other users
  public abstract CanEditType(id:number, callback: (can: boolean, err) => void ):void;

  //Update
  public abstract Update(id:number, name:string, username:string, email:string, avatar_path:string, callback: (user: User, err) => void ):void;

  //Update password
  public abstract UpdatePassword(id:number, password:string,  new_password:string, callback: (success: boolean, err) => void ):void;

  //Update type
  public abstract UpdateType(id:number, new_type:string, callback: (type: string, err) => void ):void;



}
