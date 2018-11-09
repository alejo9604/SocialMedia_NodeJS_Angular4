import * as mysql from "mysql";

/**
* / doa / album
*
* @class GeneralDAO
*         Abstract class for General - DB control
*/

export abstract class GeneralDAO{

  private connection:mysql;

  constructor(connection:mysql){
  this.connection= connection;
  }

  public getConnection(){
    return this.connection;
  }

  //Get Photos home
  public abstract  Home(user_id:number, user_type:number, from:number, canSeeAll:boolean,  callback: (data: any[], err) => void);


}
