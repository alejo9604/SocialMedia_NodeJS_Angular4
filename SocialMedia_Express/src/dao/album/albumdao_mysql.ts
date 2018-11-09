import * as mysql from "mysql";
import { AlbumDAO } from "./album.dao"
import { Album } from "../../models/album";

/**
* / da
*
* @class AlbumDAO MySQL implement
*/

export class AlbumDAO_MySQL extends AlbumDAO{

  constructor(connection:mysql){
    super(connection);
  }


  /*
    Insert Album
    -params Body:
        *name             string
        *description      string
        *userId           number
    -response:
        *Album (id, name, description, userId, creation_date, update_date)
  */
  public Insert(name:string, description:string, userId:number, callback: (album: Album, err) => void):void{
    let album:Album = new Album(0, name, description, userId);

    var query = "INSERT INTO `photoApp`.`albums` (`name`, `description`, `id_user`, `creation_date`, `update_date`) VALUES ( "
          + this.getConnection().escape(album.name) + ", "
          + this.getConnection().escape(album.description) + ", "
          + this.getConnection().escape(album.idUser) + ", "
          + this.getConnection().escape(album.creationDate) + ", "
          + this.getConnection().escape(album.updateDate) + " );";

    this.getConnection().getConnection(function(err, connection) {
        connection.query(query, function (error, results, fields) {

            connection.release();
            if (error) {
              console.log("Album.Insert - Error whit albumId: " + error);//throw error;
              error = {error: "Error Insert Album"}
            }else{
              album.id = results.insertId;
            }
            callback(album, error);
        });
    });
  }


  /*
    Update Album
    -params Body:
        *name             string
        *description      string
        *userId           number
    -response:
        *Album (id, name, description, userId, creation_date, update_date)
  */
  public Update(id:number, name:string, description:string, userId:number, callback: (album: Album, err) => void):void{
    let album:Album = new Album(id, name, description, userId);

    var query = "UPDATE `photoApp`.`albums` SET "
          + "`name` = "
          + this.getConnection().escape(album.name)
          + ", `description` = "
          + this.getConnection().escape(album.description)
          + ", `update_date` = "
          + this.getConnection().escape(album.updateDate)
          + " WHERE `id` = "
          + this.getConnection().escape(album.id)
          + " AND `id_user` = "
          + this.getConnection().escape(album.idUser)
          + ";";


    this.getConnection().getConnection(function(err, connection) {
        connection.query(query, function (error, results, fields) {

            connection.release();
            if (error ) {
              console.log("Album.UpdateAlbum - Error whit albumId: " + album.id);//throw error;
              error = {error: "Error get Album"}
            }
            callback(album, error);
        });
    });
  }


  /*
    Delete Album
    -params Body:
        *id               number
        *name             string
        *userId           number
    -response:
        *JSON {res: true/false}
  */
  public Delete(id:number, name:string, userId:number, callback: (res, err) => void):void{
    var query = "DELETE FROM `photoApp`.`albums` WHERE `photoApp`.`albums`.`id` = "
          + this.getConnection().escape(id)
          + " AND `photoApp`.`albums`.`id_user` = "
          + this.getConnection().escape(userId)
          + " AND `photoApp`.`albums`.`name` = "
          + this.getConnection().escape(name)
          + ";";

    this.getConnection().getConnection(function(err, connection) {
        connection.query(query, function (error, results, fields) {

            connection.release();
            let res = {res: true};
            if (error) {
              console.log("Album.DeleteAlbum - Error whit albumId: " + id);//throw error;
              error = {error: "Error get Album"}
              res = {res: false};
            }

            callback(res, error);
        });
    });
  }


  /*
    Get Album by Id
    -params Body:
        *albumId          number
    -response:
        *Album (id, name, description, userId, creation_date, update_date)
  */
  public GetAlbum(albumId:number, callback: (album: Album, err) => void):void{

    var query = "SELECT `albums`.`id`," +
                "`albums`.`name`," +
                "`albums`.`description`,"+
                "`albums`.`id_user`," +
                "`albums`.`creation_date`," +
                "`albums`.`update_date` " +
                "FROM `photoApp`.`albums` " +
                "WHERE `albums`.`id` = " +
                this.getConnection().escape(albumId) +
                " ORDER BY `albums`.`creation_date` DESC" +
                ";";

    this.getConnection().getConnection(function(err, connection) {
        connection.query(query, function (error, results, fields) {
            connection.release();

            let album:Album;

            if (error || results.length <= 0 ) {
              console.log(error);
              console.log("Album.GetAlbum - Error whit albumId: " + albumId);//throw error;
              error = {error: "Error get Album"}
            }else{
              album =  new Album( results[0].id, results[0].name, results[0].description, results[0].id_user, results[0].creation_date, results[0].update_date );
            }

            callback(album, error);
        });
    });
  }


  /*
    Get User's Albums
    -params Body:
        *UserId          number
    -response:
        *Album Array (id, name, description, userId, creation_date, update_date)
  */
  public AllByUserId(userId:number, callback: (album: Album[], err) => void):void{

    var query = "SELECT `albums`.`id`," +
                "`albums`.`name`," +
                "`albums`.`description`,"+
                "`albums`.`id_user`," +
                "`albums`.`creation_date`," +
                "`albums`.`update_date` " +
                "FROM `photoApp`.`albums` " +
                "WHERE `albums`.`id_user` = " +
                this.getConnection().escape(userId) + ";"

    this.getConnection().getConnection(function(err, connection) {
        connection.query(query, function (error, results, fields) {
            connection.release();

            let albums:Album[] = [];

            if (error) {
              console.log("Album.AllByUserId - Error whit userId: " + userId);
              error = {error: "Error get Albums"};
            }else{
              for(let r of results){
                albums.push( new Album( r.id, r.name, r.description, r.id_user, r.creation_date, r.update_date ));
              }
            }

            callback(albums, error);
        });
    });

  }


}
