"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const album_dao_1 = require("./album.dao");
const album_1 = require("../../models/album");
class AlbumDAO_MySQL extends album_dao_1.AlbumDAO {
    constructor(connection) {
        super(connection);
    }
    Insert(name, description, userId, callback) {
        let album = new album_1.Album(0, name, description, userId);
        var query = "INSERT INTO `photoApp`.`albums` (`name`, `description`, `id_user`, `creation_date`, `update_date`) VALUES ( "
            + this.getConnection().escape(album.name) + ", "
            + this.getConnection().escape(album.description) + ", "
            + this.getConnection().escape(album.idUser) + ", "
            + this.getConnection().escape(album.creationDate) + ", "
            + this.getConnection().escape(album.updateDate) + " );";
        this.getConnection().getConnection(function (err, connection) {
            connection.query(query, function (error, results, fields) {
                connection.release();
                if (error) {
                    console.log("Album.Insert - Error whit albumId: " + error);
                    error = { error: "Error Insert Album" };
                }
                else {
                    album.id = results.insertId;
                }
                callback(album, error);
            });
        });
    }
    Update(id, name, description, userId, callback) {
        let album = new album_1.Album(id, name, description, userId);
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
        this.getConnection().getConnection(function (err, connection) {
            connection.query(query, function (error, results, fields) {
                connection.release();
                if (error) {
                    console.log("Album.UpdateAlbum - Error whit albumId: " + album.id);
                    error = { error: "Error get Album" };
                }
                callback(album, error);
            });
        });
    }
    Delete(id, name, userId, callback) {
        var query = "DELETE FROM `photoApp`.`albums` WHERE `photoApp`.`albums`.`id` = "
            + this.getConnection().escape(id)
            + " AND `photoApp`.`albums`.`id_user` = "
            + this.getConnection().escape(userId)
            + " AND `photoApp`.`albums`.`name` = "
            + this.getConnection().escape(name)
            + ";";
        this.getConnection().getConnection(function (err, connection) {
            connection.query(query, function (error, results, fields) {
                connection.release();
                let res = { res: true };
                if (error) {
                    console.log("Album.DeleteAlbum - Error whit albumId: " + id);
                    error = { error: "Error get Album" };
                    res = { res: false };
                }
                callback(res, error);
            });
        });
    }
    GetAlbum(albumId, callback) {
        var query = "SELECT `albums`.`id`," +
            "`albums`.`name`," +
            "`albums`.`description`," +
            "`albums`.`id_user`," +
            "`albums`.`creation_date`," +
            "`albums`.`update_date` " +
            "FROM `photoApp`.`albums` " +
            "WHERE `albums`.`id` = " +
            this.getConnection().escape(albumId) +
            " ORDER BY `albums`.`creation_date` DESC" +
            ";";
        this.getConnection().getConnection(function (err, connection) {
            connection.query(query, function (error, results, fields) {
                connection.release();
                let album;
                if (error || results.length <= 0) {
                    console.log(error);
                    console.log("Album.GetAlbum - Error whit albumId: " + albumId);
                    error = { error: "Error get Album" };
                }
                else {
                    album = new album_1.Album(results[0].id, results[0].name, results[0].description, results[0].id_user, results[0].creation_date, results[0].update_date);
                }
                callback(album, error);
            });
        });
    }
    AllByUserId(userId, callback) {
        var query = "SELECT `albums`.`id`," +
            "`albums`.`name`," +
            "`albums`.`description`," +
            "`albums`.`id_user`," +
            "`albums`.`creation_date`," +
            "`albums`.`update_date` " +
            "FROM `photoApp`.`albums` " +
            "WHERE `albums`.`id_user` = " +
            this.getConnection().escape(userId) + ";";
        this.getConnection().getConnection(function (err, connection) {
            connection.query(query, function (error, results, fields) {
                connection.release();
                let albums = [];
                if (error) {
                    console.log("Album.AllByUserId - Error whit userId: " + userId);
                    error = { error: "Error get Albums" };
                }
                else {
                    for (let r of results) {
                        albums.push(new album_1.Album(r.id, r.name, r.description, r.id_user, r.creation_date, r.update_date));
                    }
                }
                callback(albums, error);
            });
        });
    }
}
exports.AlbumDAO_MySQL = AlbumDAO_MySQL;
