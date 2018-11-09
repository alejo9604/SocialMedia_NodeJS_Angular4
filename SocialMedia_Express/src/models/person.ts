import * as validator from "validator";

/**
* / models
*
* @class Person
*/

export abstract class Person{

  private _id:number;
  private _name:string

  constructor( id:number, name:string ){
    this._id = id;
    this._name = name;
  }

  get name():string{
    return this._name;
  }

  set name( name:string) {
    this.validateEmpty(name);
    this._name = name;
  }

  get id():number{
    return this._id;
  }

  set id( id:number ) {
    //this.validateEmpty(id);
    this._id = id;
  }


  validateEmpty(value){
    if(validator.isEmpty(value)){
      throw Error ("Error data user!");
    }
  }
}
