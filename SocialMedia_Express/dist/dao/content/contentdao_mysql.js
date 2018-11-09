"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const content_dao_1 = require("./content.dao");
const content_1 = require("../../models/content");
class ContentDAO_MySQL extends content_dao_1.ContentDAO {
    constructor(connection) {
        super(connection);
    }
    Insert(albumId, photoId, callback) {
        let content = new content_1.Content(albumId, photoId, 0);
        var query = "INSERT INTO `photoApp`.`content` (`id_album`, `ip`, `order`, `creation_date`, `update_date`) SELECT "
            + this.getConnection().escape(content.idAlbum) + ", "
            + this.getConnection().escape(content.idPhoto) + ", "
            + "IFNULL(MAX(`photoApp`.`content`.`order`), 0) + 1, "
            + this.getConnection().escape(content.creationDate) + ", "
            + this.getConnection().escape(content.updateDate)
            + "FROM  `photoApp`.`content` WHERE `photoApp`.`content`.`id_album` = "
            + this.getConnection().escape(content.idAlbum)
            + ";";
        this.getConnection().getConnection(function (err, connection) {
            connection.query(query, function (error, results, fields) {
                connection.release();
                if (error) {
                    console.log("Error whit " + content.idAlbum + " + " + content.idPhoto);
                }
                else
                    content.order = results.order;
                callback(content, error);
            });
        });
    }
    AllByAlbumID(albumId, limit, callback) {
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
        if (limit > 0) {
            query += "LIMIT " +
                this.getConnection().escape(limit);
        }
        query += ";";
        this.getConnection().getConnection(function (err, connection) {
            connection.query(query, function (error, results, fields) {
                connection.release();
                if (error)
                    console.log("ContentDAO_MySQL.AllByAlbumID - Error whit albumId: " + albumId);
                callback(results, error);
            });
        });
    }
    ExchangePhoto(albumId, p1Id, p1Order, p2Id, p2Order, callback) {
        var query = "UPDATE `photoApp`.`content` " +
            "SET `order` = CASE `ip` " +
            "WHEN " + this.getConnection().escape(p1Id) + " THEN " + this.getConnection().escape(p1Order) + " " +
            "WHEN " + this.getConnection().escape(p2Id) + " THEN " + this.getConnection().escape(p2Order) + " " +
            "ELSE `order` " +
            "END " +
            "WHERE `id_album` = " +
            this.getConnection().escape(albumId) +
            ";";
        this.getConnection().getConnection(function (err, connection) {
            connection.query(query, function (error, results, fields) {
                connection.release();
                let succes = { succes: "succes" };
                if (error) {
                    console.log("Content.ExchangePhoto - Error whit albumId: " + error);
                    error = { error: "Error Exchange Photo" };
                    succes = { succes: "error" };
                }
                callback(succes, error);
            });
        });
    }
}
exports.ContentDAO_MySQL = ContentDAO_MySQL;
