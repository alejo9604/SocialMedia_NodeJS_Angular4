import * as mysql from "mysql";
import * as bcrypt from "bcrypt-nodejs";

import { GeneralDAO } from "./general.dao";

/**
* / dao
*
* @class GeneralDAO MySQL implement
*/


export class GeneralDAO_MySQL extends GeneralDAO{


  constructor(connection:mysql){
    super(connection);
  }

  /*
    Get Photos home
    -params Body:
        *user_id:     number
        *user_type:   number
        *limit:       number
    -response:
        *photos Array {id, title, description, photo_path, creation_date, user_id, username, album_id, album_name}
  */

  public Home(user_id:number, user_type:number, from:number, canSeeAll:boolean, callback: (data:any[], err) => void) :void{

    let photos:any[] = [];
    let limit:number = 10;

    var query = "SELECT table_2.*, albums.id AS album_id, albums.name AS album_name FROM ( "
          + "SELECT photos.id, photos.title, photos.description, photos.photo_path, photos.creation_date, photos.owner AS user_id, users.username "
          + "FROM photoApp.photos, photoApp.users WHERE "
          + "photos.owner <> " + this.getConnection().escape(user_id) + " AND "
          + "photos.owner = users.id "
          + (canSeeAll ?  " " : "AND users.id_type = " + this.getConnection().escape(user_type) + " ")
          + "ORDER BY photos.creation_date DESC "
          + "LIMIT " + (this.getConnection().escape(from)) + ", "
          + this.getConnection().escape(limit + 1) +" ) AS table_2 "
          + "INNER JOIN photoApp.content ON content.id_photo = table_2.id "
          + "INNER JOIN photoApp.albums ON content.id_album = albums.id;";


    this.getConnection().getConnection(function(err, connection) {
       connection.query(query, function(error, results, fields){

           connection.release

           if (error) {
             console.log(error);
             console.log("General.Home - Error whit user: " + user_id);//throw error;
             error = {error: "Error General Home"}
           }else{

             for (let r of results){
               photos.push(
                 {
                   id: r.id,
                   title: r.title,
                   description: r.description,
                   photo_path: r.photo_path,
                   creation_date: r.creation_date,
                   user_id: r.user_id,
                   username: r.username,
                   album_id: r.album_id,
                   album_name: r.album_name
                 }
               )
             }
           }

           callback(photos, error);
        });
    });

  }


}
