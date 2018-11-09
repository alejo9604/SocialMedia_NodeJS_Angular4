import * as validator from "validator";

/**
* / models
*
* @class Photo
*/

export class Photo{

  private _id:number;
  private _title:string;
  private _description:string;
  private _photo_path:string;
  private _creation_date:Date;
  private _update_date:Date;
  private _owner:number;

  constructor(id:number, title:string, description:string, photo_path:string, owner:number){
    this.id = id;
    this.title = title;
    this.descripton = description;
    this.photoPath = photo_path;
    this._creation_date = new Date();
    this._update_date = new Date();
    this.owner = owner;
  }
  //Getters & Setters
  get id():number{
    return this._id;
  }
  set id( id:number )  {
    //this.validateEmpty(id);
    this._id = id;
  }

  get title():string{
    return this._title;
  }
  set title( title:string )  {
    this.validateEmpty(title);
    this._title = title;
  }

  get descripton():string{
    return this._description;
  }
  set descripton( description:string )  {
    //this.validateEmpty(description);
    this._description = description;
  }

  get photoPath():string{
    return this._photo_path;
  }
  set photoPath( photo_path:string )  {
    //this.validateEmpty(photo_path);
    this._photo_path = photo_path;
  }

  get creationDate():Date{
    return this._creation_date;
  }
  set creationDate( creation_date:Date )  {
    this._creation_date = creation_date;
  }

  get updateDate():Date{
    return this._update_date;
  }
  set updateDate( update_date:Date )  {
    this._update_date = update_date;
  }

  get owner():number{
    return this._owner;
  }
  set owner( owner:number )  {
    //this.validateEmpty(owner);
    this._owner = owner;
  }



  private validateEmpty(value){
    if(validator.isEmpty(value)){
      throw Error ("Error data user!");
    }
  }

}
