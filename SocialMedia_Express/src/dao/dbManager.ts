import { DB_MySQL } from "./dbMySQL";
import { DBAbstract } from "./dbAbstract";

/**
* / dao
*
* @class DBManager
*/

export class DBManager{

  //DB Types
  public static readonly MySQL:string = "MySQL"

  //DBs
  public static _dbMySQL:DB_MySQL = null;


  /*
    Get DB
    -params Body:
        *DB Types         string - Defult: MySQL
    -response:
        *DB               DBAbstract
  */
  public static getDB( type:string = "MySQL" ):DBAbstract{
    if( type == DBManager.MySQL){
      return this.getDBMySQL();
    }
    return null;
  }

  /*
    Get DB MySQL
    -params Body:

    -response:
        *DB               DBAbstract -> DB_MySQL
  */
  public static getDBMySQL():DBAbstract{
    if(this._dbMySQL == null){
      this._dbMySQL = new DB_MySQL();
    }
    return this._dbMySQL;
  }

}
