import * as validator from "validator";

/**
* / models
*
* @class Album
*/

export class Album{

  private _id:number;
  private _name:string;
  private _description:string;
  private _id_user:number;
  private _creation_date:Date;
  private _update_date:Date;

  constructor(id:number, name:string, description:string, id_user:number, creation_date:Date = new Date(), update_date:Date = new Date()){
    this.id = id;
    this.name = name;
    this.description = description;
    this.idUser = id_user;
    this._creation_date = creation_date;
    this._update_date = update_date;
  }

  //Getters & Setters
  get id():number{
    return this._id;
  }
  set id( id:number ){
    //this.validateEmpty(id);
    this._id = id;
  }

  get name():string{
    return this._name;
  }
  set name( name:string ){
    this.validateEmpty(name);
    this._name = name;
  }

  get description():string{
    return this._description;
  }
  set description( description:string ){
    //this.validateEmpty(description);
    this._description = description;
  }

  get idUser():number{
    return this._id_user;
  }
  set idUser( id_user:number ){
    //this.validateEmpty(id_user);
    this._id_user = id_user;
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
