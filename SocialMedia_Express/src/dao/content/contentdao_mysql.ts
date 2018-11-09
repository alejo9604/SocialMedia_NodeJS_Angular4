import * as mysql from "mysql";
import { ContentDAO } from "./content.dao"
import { Content } from "../../models/content";

/**
* / da
*
* @class ContentDAO MySQL implement
*/


export class ContentDAO_MySQL extends ContentDAO{

  constructor(connection:mysql){
    super(connection);
  }

  /*
    Insert Content
    -params Body:
        *albumId          number
        *photoId          number
    -response:
        *Content (albumId, photoId, order)
  */
  public Insert(albumId:number, photoId:number, callback: (content: Content, err) => void):void{

    let content = new Content(albumId, photoId, 0);

    /*
    var query = "INSERT INTO `photoApp`.`content` (`id_album`, `id_photo`, `order`, `creation_date`, `update_date`) VALUES ( "
          + this.getConnection().escape(content.idAlbum) + ", "
          + this.getConnection().escape(content.idPhoto) + ", "
          + this.getConnection().escape(content.order) + ", "
          + this.getConnection().escape(content.creationDate) + ", "
          + this.getConnection().escape(content.updateDate) + " );";
    */

    var query = "INSERT INTO `photoApp`.`content` (`id_album`, `ip`, `order`, `creation_date`, `update_date`) SELECT "
          + this.getConnection().escape(content.idAlbum) + ", "
          + this.getConnection().escape(content.idPhoto) + ", "
          + "IFNULL(MAX(`photoApp`.`content`.`order`), 0) + 1, "
          + this.getConnection().escape(content.creationDate) + ", "
          + this.getConnection().escape(content.updateDate)
          + "FROM  `photoApp`.`content` WHERE `photoApp`.`content`.`id_album` = "
          + this.getConnection().escape(content.idAlbum)
          + ";";

    this.getConnection().getConnection(function(err, connection) {
        connection.query(query, function (error, results, fields) {

            connection.release();
            if (error){

              console.log("Error whit " + content.idAlbum + " + " + content.idPhoto);//throw error;
            }else
              content.order = results.order;

            callback(content, error);
        });
    });
  }



  /*
    Get content By albumId
    -params Body:
        *albumId          number
        *limit            number
    -response:
        *Content Array (albumId, photoId, order)
  */
  public AllByAlbumID(albumId:number, limit:number, callback: (album: Content[], err) => void):void{
    var query = "SELECT `photos`.`id`, " +
                "`photos`.`title`, " +
                "`photos`.`description`, " +
                "`photos`.`photo_path`, " +
                "`photos`.`creation_date`, " +
                "`photos`.`update_date`, " +
                "`content`.`order` " +
                "FROM `photoApp`.`photos`, `photoApp`.`content` " +
                "WHERE `content`.`id_album` = " +
                this.getConnection().escape(albumId) +
                " AND `photos`.`id` = `content`.`ip` " +
                "ORDER BY `content`.`order` ";

      if(limit > 0){
        query += "LIMIT " +
                  this.getConnection().escape(limit);
      }
      query += ";";

      //console.log(query);
      this.getConnection().getConnection(function(err, connection) {
          connection.query(query, function (error, results, fields) {

              connection.release();
              if (error) console.log("ContentDAO_MySQL.AllByAlbumID - Error whit albumId: " + albumId);

              callback(results, error);
          });
      });
  }



  /*
    Get content By albumId
    -params Body:
        *albumId          number
        *limit            number
    -response:
        *Content Array (albumId, photoId, order)
  */
public ExchangePhoto(albumId:number, p1Id:number, p1Order:number, p2Id:number, p2Order:number, callback: (succes, err) => void):void{
  var query = "UPDATE `photoApp`.`content` " +
              "SET `order` = CASE `ip` " +
              "WHEN " + this.getConnection().escape(p1Id) +" THEN " +  this.getConnection().escape(p1Order) + " "+
              "WHEN " + this.getConnection().escape(p2Id) +" THEN " +  this.getConnection().escape(p2Order) + " "+
              "ELSE `order` " +
              "END " +
              "WHERE `id_album` = " +
              this.getConnection().escape(albumId) +
              ";";


  this.getConnection().getConnection(function(err, connection) {
        connection.query(query, function (error, results, fields) {

            connection.release();

            let succes = {succes: "succes"};

            if (error) {
              console.log("Content.ExchangePhoto - Error whit albumId: " + error);//throw error;
              error = {error: "Error Exchange Photo"}
              succes = {succes: "error"}
            }
            callback(succes, error);
        });
    });


 }



}
