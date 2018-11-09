"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const photo_dao_1 = require("./photo.dao");
const photo_1 = require("../../models/photo");
class PhotoDAO_MySQL extends photo_dao_1.PhotoDAO {
    constructor(connection) {
        super(connection);
    }
    Insert(title, description, path, userId, callback) {
        let photo = new photo_1.Photo(0, title, description, path, userId);
        var query = "INSERT INTO `photoApp`.`photos` (`title`,`description`,`photo_path`,`creation_date`,`update_date`, `owner`) VALUES ( "
            + this.getConnection().escape(photo.title) + ", "
            + this.getConnection().escape(photo.descripton) + ", "
            + this.getConnection().escape(photo.photoPath) + ", "
            + this.getConnection().escape(photo.creationDate) + ", "
            + this.getConnection().escape(photo.updateDate) + ", "
            + this.getConnection().escape(photo.owner) + " );";
        this.getConnection().getConnection(function (err, connection) {
            connection.query(query, function (error, results, fields) {
                connection.release();
                if (error)
                    throw error;
                photo.id = results.insertId;
                callback(photo, error);
            });
        });
    }
    Update(id, title, description, userId, callback) {
        let photo = new photo_1.Photo(id, title, description, "", userId);
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
        this.getConnection().getConnection(function (err, connection) {
            connection.query(query, function (error, results, fields) {
                connection.release();
                if (error)
                    console.log("Error whit " + photo.title);
                else if (results.affectedRows == 0) {
                    console.log("Photo.Update - Error whit photo" + id);
                    return callback(null, { error: "Error data on Update!" });
                }
                callback(photo, error);
            });
        });
    }
    Delete(id, path, userId, callback) {
        var query = "DELETE FROM `photoApp`.`photos` WHERE `photoApp`.`photos`.`id` = "
            + this.getConnection().escape(id)
            + " AND `photoApp`.`photos`.`photo_path` = "
            + this.getConnection().escape(path)
            + " AND `photoApp`.`photos`.`owner` = "
            + this.getConnection().escape(userId)
            + ";";
        this.getConnection().getConnection(function (err, connection) {
            connection.query(query, function (error, results, fields) {
                connection.release();
                let res = { res: true };
                if (error) {
                    console.log("Photo.DeletePhoto - Error whit photoId: " + id);
                    error = { error: "Error delete Photo" };
                    res = { res: false };
                }
                callback(res, error);
            });
        });
    }
}
exports.PhotoDAO_MySQL = PhotoDAO_MySQL;
