
import * as mysql from "mysql";
import { PhotoDAO } from "./photo.dao"
import { Photo } from "../../models/photo";

/**
* / da
*
* @class PhotoDAO MySQL implement
*/


export class PhotoDAO_MySQL extends PhotoDAO{

  constructor(connection:mysql){
    super(connection);
  }

  /*
    Insert Photo
    -params Body:
        *title            string
        *description      string
        *path             string
        *userId           number
    -response:
        *Photo (id, title, description, path, owner)
  */
  public Insert(title:string, description:string, path:string, userId:number, callback: (photo: Photo, err) => void):void{

    let photo:Photo = new Photo(0, title, description, path, userId);

    var query = "INSERT INTO `photoApp`.`photos` (`title`,`description`,`photo_path`,`creation_date`,`update_date`, `owner`) VALUES ( "
          + this.getConnection().escape(photo.title) + ", "
          + this.getConnection().escape(photo.descripton) + ", "
          + this.getConnection().escape(photo.photoPath) + ", "
          + this.getConnection().escape(photo.creationDate) + ", "
          + this.getConnection().escape(photo.updateDate) + ", "
          + this.getConnection().escape(photo.owner) + " );";

    this.getConnection().getConnection(function(err, connection) {
        connection.query(query, function (error, results, fields) {

            connection.release();
            if (error) throw error;//console.log("Error whit " + photo.title)

            photo.id = results.insertId;
            callback(photo, error);
        });
    });
  }

  /*
    Update Photo
    -params Body:
        *id               number
        *title            string
        *description      string
        *path             string
        *userId           number
    -response:
        *Photo (id, title, description, path, owner)
  */
  public Update(id:number, title:string, description:string, userId:number, callback: (album: Photo, err) => void):void{
    let photo:Photo = new Photo(id, title, description, "", userId);

    var query = "UPDATE `photoApp`.`photos` SET "
          + "`title` = "
          + this.getConnection().escape(photo.title)
          + ", `description` = "
          + this.getConnection().escape(photo.descripton)
          + ", `update_date` = "
          + this.getConnection().escape(photo.updateDate)
          + " WHERE `id` = "
          + this.getConnection().escape(photo.id)
          + " AND `owner` = "
          + this.getConnection().escape(photo.owner)
          + ";";

    this.getConnection().getConnection(function(err, connection) {
        connection.query(query, function (error, results, fields) {

            connection.release();
            if (error) console.log("Error whit " + photo.title)//throw error;
            else if(results.affectedRows  == 0){
              console.log("Photo.Update - Error whit photo" + id)//throw error;
              return callback(null, { error: "Error data on Update!" });
            }

            callback(photo, error);
        });
    });
  }


  /*
    Delete Photo
    -params Body:
        *id               number
        *path             string
        *userId           number
    -response:
        *JSON {res: true/false}
  */
  public Delete(id:number, path:string, userId:number, callback: (res, err) => void):void{
    var query = "DELETE FROM `photoApp`.`photos` WHERE `photoApp`.`photos`.`id` = "
          + this.getConnection().escape(id)
          + " AND `photoApp`.`photos`.`photo_path` = "
          + this.getConnection().escape(path)
          + " AND `photoApp`.`photos`.`owner` = "
          + this.getConnection().escape(userId)
          + ";";

    this.getConnection().getConnection(function(err, connection) {
        connection.query(query, function (error, results, fields) {

            connection.release();
            let res = {res: true};
            if (error) {
              console.log("Photo.DeletePhoto - Error whit photoId: " + id);//throw error;
              error = {error: "Error delete Photo"}
              res = {res: false};
            }

            callback(res, error);
        });
    });
  }

}
