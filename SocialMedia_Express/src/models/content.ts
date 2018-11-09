import * as validator from "validator";

/**
* / models
*
* @class Content
*/

export class Content{

  private _id_album:number;
  private _id_photo:number;
  private _order:number;
  private _creation_date:Date;
  private _update_date:Date;

  constructor(id_album:number, id_photo:number, order:number){
    this.idAlbum = id_album;
    this.idPhoto = id_photo;
    this.order = order;
    this._creation_date = new Date();
    this._update_date = new Date();
  }

  //Getters & Setters
  get idAlbum():number{
    return this._id_album;
  }
  set idAlbum( id_album:number ){
    //this.validateEmpty(id_album);
    this._id_album = id_album;
  }

  get idPhoto():number{
    return this._id_photo;
  }
  set idPhoto( id_photo:number ){
    //this.validateEmpty(id_photo);
    this._id_photo = id_photo;
  }

  get order():number{
    return this._order;
  }
  set order( order:number ){
    //this.validateEmpty(order);
    this._order = order;
  }

  get creationDate():Date{
    return this._creation_date;
  }
  set creationDate( creation_date:Date ){
    this._creation_date = creation_date;
  }

  get updateDate():Date{
    return this._update_date;
  }
  set updateDate( update_date:Date ){
    this._update_date = update_date;
  }


  private validateEmpty(value){
    if(validator.isEmpty(value)){
      throw Error ("Error data user!");
    }
  }
}
