 import { DBAbstract } from "./dbAbstract";
 import * as mysql from "mysql";
 import { UserDAO_MySQL } from "./user/userdao_mysql"
 import { AlbumDAO_MySQL } from "./album/albumdao_mysql"
 import { PhotoDAO_MySQL } from "./photo/photodao_mysql"
 import { ContentDAO_MySQL } from "./content/contentdao_mysql"
 import { GeneralDAO_MySQL } from "./general/generaldao_mysql"


 /**
 * / dao
 *
 * @class DB_MySQL
 */

export class DB_MySQL extends DBAbstract{

  constructor(){

    //MySQL Connection
    let connection = mysql.createPool({
      host     : process.env.MYSQL_HOST,
      user     : process.env.MYSQL_USER,
      password : process.env.MYSQL_PASS,
      database : process.env.MYSQL_DATABASE
    });

    let userDAO = new UserDAO_MySQL( connection );
    let albumDAO = new AlbumDAO_MySQL( connection );
    let photoDAO = new PhotoDAO_MySQL( connection );
    let contentDAO = new ContentDAO_MySQL( connection );
    let generalDAO = new GeneralDAO_MySQL( connection );

    super( userDAO, albumDAO, photoDAO, contentDAO, generalDAO );
  }
}
