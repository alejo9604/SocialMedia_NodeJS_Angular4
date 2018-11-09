import * as mysql from "mysql";
import { Content } from "../../models/content";

/**
* / doa / album
*
* @class ContentDAO
*         Abstract class for Content - DB control
*/

export abstract class ContentDAO{

  private connection:mysql;

  constructor(connection:mysql){
  this.connection= connection;
  }

  public getConnection(){
    return this.connection;
  }

  /* DAO methods */

  //Insert
  public abstract Insert(userId:number, albumId:number, callback: (content: Content, err) => void):void;

  //Get content By albumId
  public abstract AllByAlbumID(albumId:number, limit:number, callback: (album: Content[], err) => void):void;
  public abstract ExchangePhoto(albumId:number, p1Id:number, p1Order:number, p2Id:number, p2Order:number, callback: (succes, err) => void):void;

}
