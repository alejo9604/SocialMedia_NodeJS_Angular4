import { Request } from "express";
import * as mysql from "mysql";
import { Album } from "../../models/album";

/**
* / doa / album
*
* @class AlbumDAO
*         Abstract class for Album - DB control
*/

export abstract class AlbumDAO{

  private connection:any;

  constructor(connection:any){
    this.connection= connection;
  }

  public getConnection(){
    return this.connection;
  }

  /* DAO methods */

  //Insert
  public abstract  Insert(name:string, description:string, userId:number, callback: (album: Album, err) => void):void;

  //Update
  public abstract  Update(id:number, name:string, description:string, userId:number, callback: (album: Album, err) => void):void;

  //Delete
  public abstract Delete(id:number, name:string, userId:number, callback: (res, err) => void):void;

  // Get Album by id
  public abstract GetAlbum(albumId:number, callback: (album: Album, err) => void):void

  //Get User's Albums
  public abstract AllByUserId(userId:number, callback: (album: Album[], err) => void):void;

}
