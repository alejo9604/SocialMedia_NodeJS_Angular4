import * as mysql from "mysql";
import * as bcrypt from "bcrypt-nodejs";

import { UserDAO } from "./user.dao";
import { User } from "../../models/user";

/**
* / da
*
* @class UserDAO MySQL implement
*/


export class UserDAO_MySQL extends UserDAO{


  constructor(connection:mysql){
    super(connection);
  }

  /*
    Get all user
    -params Body:
    -response:
        *User Array (id, name, username, password, email, avatar)
  */

  public all(callback: (data:User[], err) => void) :void{

    let users:User[] = [];

    this.getConnection().getConnection(function(err, connection) {
       connection.query('SELECT * FROM `photoApp`.`users`;', function(error, results, fields){

           connection.release();

           //console.log(results);
           for (let r of results){
             //console.log(r);
             users.push( new User( r.id, r.name, r.username, r.password, r.email, r.avatar_path, r.id_type ) );
           }
           callback(users, error);
        });
    });

  }


  /*
    Get all user
    -params Body:
        *username       string
    -response:
        *User (id, name, username, password, email, avatar)
  */
  public findOne(username:string, callback: (data:User, err) => void) :void{

    let query = "SELECT `users`.`id`, `users`.`name`, `users`.`username`, `users`.`password`, `users`.`email`, `users`.`avatar_path`, `users`.`id_type` FROM `photoApp`.`users` WHERE `users`.`username` = "
                + this.getConnection().escape(username)
                + ";";

    this.getConnection().getConnection(function(err, connection) {
       connection.query( query, function(error, results, fields){

           connection.release();
           if(error){
             return callback(null, error);
           }
           if(results.length <= 0)
             return callback(null, {error: "No found"});

           let user = new User(results[0].id, results[0].name, results[0].username, results[0].password, results[0].email, results[0].avatar_path, results[0].id_type);

           callback(user, error);
        });
    });

  }


  /*
    Get all user
    -params Body:
        *userId       number
    -response:
        *User (id, name, username, password, email, avatar)
  */
  public findOneById(userId:number, callback: (data:User, err) => void) :void{

    let query = "SELECT `users`.`id`, `users`.`name`, `users`.`username`, `users`.`password`, `users`.`email`, `users`.`avatar_path`, `users`.`id_type` FROM `photoApp`.`users` WHERE `users`.`id` = "
                + this.getConnection().escape(userId)
                + ";";

    this.getConnection().getConnection(function(err, connection) {
       connection.query( query, function(error, results, fields){

           connection.release();
           if(error){
             return callback(null, error);
           }
           if(results.length <= 0)
             return callback(null, {error: "No found"});

           let user = new User(results[0].id, results[0].name, results[0].username, results[0].password, results[0].email, results[0].avatar_path, results[0].id_type);

           callback(user, error);
        });
    });

  }




  /*
    Insert User
    -params Body:
        *name               string
        *username           string
        *password           string
        *email              string
        *avatar_path        string
    -response:
        *User (id, name, username, password, email, avatar)
  */
  public Insert(name:string, username:string, password:string, email:string, avatar_path:string, callback: (user: User, err) => void ):void{

    let user = new User(0, name, username, password, email, avatar_path, 1);

    let conn = this.getConnection();

    User.hashPassword(user.password, function(pass:string, error){

      if(error){
        return callback(null, error);
      }

      user.password = pass;


      var query = "INSERT INTO `photoApp`.`users` (`name`, `username`, `password`, `email`, `avatar_path`) VALUES ( "
            + conn.escape(user.name) + ", "
            + conn.escape(user.username) + ", "
            + conn.escape(user.password) + ", "
            + conn.escape(user.email) + ", "
            + conn.escape(user.avatar_path) + " );";

      conn.getConnection(function(err, connection) {
          connection.query(query, function (error, results, fields) {

              connection.release();
              if (error){
                console.log(error);
                console.log("User.Insert - Error whit user" + user.name)//throw error;
                return callback(null, error);
              }

              user.id = results.insertId;
              callback(user, error);
          });
      });
    });

  }



  /*
    Update User
    -params Body:
        *id                 string
        *name               string
        *username           string
        *email              string
        *avatar_path        string
    -response:
        *User (id, name, username, password, email, avatar)
  */
  public Update(id:number, name:string, username:string, email:string, avatar_path:string, callback: (user: User, err) => void ):void{

    let user = new User(id, name, username, "NA", email, avatar_path, 1);

    let conn = this.getConnection();

    var query = "UPDATE `photoApp`.`users` SET "
          + "`name` = " + conn.escape(user.name) + ", "
          + "`email` = " + conn.escape(user.email) + ", "
          + "`avatar_path` = " + conn.escape(user.avatar_path) + " "
          + "WHERE "
          + "`id` = " + conn.escape(user.id) + " AND "
          + "`username` = " + conn.escape(user.username) + ";";

    conn.getConnection(function(err, connection) {
        connection.query(query, function (error, results, fields) {

            connection.release();
            if (error){
              console.log(error);
              console.log("User.Update - Error whit user" + user.name)//throw error;
              return callback(null, error);
            }

            callback(user, error);
        });
    });

  }


  /*
    Update password
    -params Body:
        *id                 number
        *password           string
        *new_password       string
    -response:
        succes: true/false
  */
  public UpdatePassword(id:number, password:string, new_password:string, callback: (success: boolean, err) => void ):void{

    if(!User.testPassword(new_password)){
      return callback(false, {error: "Error data security!"});
    }

    let conn = this.getConnection();

    User.hashPassword(new_password, function(pass:string, error){

      if(error){
        return callback(false, error);
      }


      var query = "UPDATE `photoApp`.`users` SET "
            + "`password` = " + conn.escape(pass) + " "
            + "WHERE "
            + "`id` = " + conn.escape(id) + ";";

      conn.getConnection(function(err, connection) {
          connection.query(query, function (error, results, fields) {

              connection.release();
              if (error){
                //console.log(error);
                console.log("User.UpdatePassword - Error whit user" + id)//throw error;
                callback(null, error);
              }
              callback(true, error);
          });
      });
    });
  }

  /*
    Can See All photos
    -params Body:
        *id                 string
    -response:
        *canEditType        boolean
  */
  public CanSeePhotos(id:number, callback: (can: boolean, err) => void ):void{

    let conn = this.getConnection();

    var query = "SELECT type_user.canSeePhotos FROM photoApp.users, photoApp.type_user WHERE users.id_type = type_user.id AND "
          + "users.id = " + conn.escape(id) + ";";

    conn.getConnection(function(err, connection) {
        connection.query(query, function (error, results, fields) {

            connection.release();
            if (error){
              console.log(error);
              console.log("User.CanSeePhotos - Error whit user - " + id)//throw error;
              return callback(null, error);
            }else if(results.length === 0){
              console.log("User.CanSeePhotos - Error whit user" + id)//throw error;
              return callback(null, { error: "Error data security!" });
            }

            callback(!!results[0].canSeePhotos, error);
        });
    });

  }



  /*
    isSameType
    -params Body:
        *id1                number
        *id2                number
    -response:
        *isSameType        boolean
  */
  public isSameType(id1:number, id2:number, callback: (can: boolean, err) => void ):void{

    let conn = this.getConnection();

    var query = "SELECT u2.* FROM photoApp.users u1, photoApp.users u2 WHERE "
          + "u1.id = " + conn.escape(id1) + " AND "
          + "u2.id = " + conn.escape(id2) + " AND "
          + "u1.id_type = u2.id_type;";

    conn.getConnection(function(err, connection) {
        connection.query(query, function (error, results, fields) {

            connection.release();
            if (error){
              console.log(error);
              console.log("User.isSameType - Error whit user - " + id1 + " and " + id2)//throw error;
              return callback(null, error);
            }else if(results.length === 0){
              return callback(false, error);
            }

            callback(true, error);
        });
    });

  }

  /*
    Can Edit Type User
    -params Body:
        *id                 string
    -response:
        *canEditType        boolean
  */
  public CanEditType(id:number, callback: (can: boolean, err) => void ):void{

    let conn = this.getConnection();

    var query = "SELECT type_user.canEditType FROM photoApp.users, photoApp.type_user WHERE users.id_type = type_user.id AND "
          + "users.id = " + conn.escape(id) + ";";

    conn.getConnection(function(err, connection) {
        connection.query(query, function (error, results, fields) {

            connection.release();
            if (error){
              console.log(error);
              console.log("User.CanEditType - Error whit user - " + id)//throw error;
              return callback(null, error);
            }else if(results.length === 0){
              console.log("User.CanEditType - Error whit user" + id)//throw error;
              return callback(null, { error: "Error data security!" });
            }

            callback(!!results[0].canEditType, error);
        });
    });

  }


  /*
    Update User Type
    -params Body:
        *id                 string
        *name               string
        *username           string
        *email              string
        *avatar_path        string
    -response:
        *User (id, name, username, password, email, avatar)
  */
  public UpdateType(id:number, new_type:string, callback: (type: string, err) => void ):void{

    let conn = this.getConnection();

    var query = "UPDATE `photoApp`.`users` JOIN `photoApp`.`type_user` ON "
          + "users.id = " + conn.escape(id) + " AND "
          + "type_user.id = " + conn.escape(new_type) + " "
          + "SET users.id_type = type_user.id;";

    conn.getConnection(function(err, connection) {
        connection.query(query, function (error, results, fields) {

            connection.release();

            if (error){
              console.log(error);
              console.log("User.UpdateType - Error whit user" + id)//throw error;
              return callback(null, error);
            }else if(results.affectedRows  == 0){
              console.log("User.UpdateType - Error whit user" + id)//throw error;
              return callback(null, { error: "Error data on Update!" });
            }

            callback(new_type, error);
        });
    });

  }



}
