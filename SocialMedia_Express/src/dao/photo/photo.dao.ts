import * as mysql from "mysql";
import { Photo } from "../../models/photo";

/**
* / doa / album
*
* @class PhotoDAO
*         Abstract class for Photo - DB control
*/

export abstract class PhotoDAO{

  private connection:mysql;

  constructor(connection:mysql){
  this.connection= connection;
  }

  public getConnection(){
    return this.connection;
  }

  /* DAO methods */

  //Insert
  public abstract Insert(title:string, description:string, path:string, userId:number, callback: (photo: Photo, err) => void):void;

  //Update
  public abstract Update(id:number, title:string, description:string, userId:number, callback: (album: Photo, err) => void):void;

  //Delete
  public abstract Delete(id:number, path:string, userId:number, callback: (res, err) => void):void;


}
