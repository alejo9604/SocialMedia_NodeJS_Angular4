"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const general_dao_1 = require("./general.dao");
class GeneralDAO_MySQL extends general_dao_1.GeneralDAO {
    constructor(connection) {
        super(connection);
    }
    Home(user_id, user_type, from, canSeeAll, callback) {
        let photos = [];
        let limit = 10;
        var query = "SELECT table_2.*, albums.id AS album_id, albums.name AS album_name FROM ( "
            + "SELECT photos.id, photos.title, photos.description, photos.photo_path, photos.creation_date, photos.owner AS user_id, users.username "
            + "FROM photoApp.photos, photoApp.users WHERE "
            + "photos.owner <> " + this.getConnection().escape(user_id) + " AND "
            + "photos.owner = users.id "
            + (canSeeAll ? " " : "AND users.id_type = " + this.getConnection().escape(user_type) + " ")
            + "ORDER BY photos.creation_date DESC "
            + "LIMIT " + (this.getConnection().escape(from)) + ", "
            + this.getConnection().escape(limit + 1) + " ) AS table_2 "
            + "INNER JOIN photoApp.content ON content.id_photo = table_2.id "
            + "INNER JOIN photoApp.albums ON content.id_album = albums.id;";
        this.getConnection().getConnection(function (err, connection) {
            connection.query(query, function (error, results, fields) {
                connection.release;
                if (error) {
                    console.log(error);
                    console.log("General.Home - Error whit user: " + user_id);
                    error = { error: "Error General Home" };
                }
                else {
                    for (let r of results) {
                        photos.push({
                            id: r.id,
                            title: r.title,
                            description: r.description,
                            photo_path: r.photo_path,
                            creation_date: r.creation_date,
                            user_id: r.user_id,
                            username: r.username,
                            album_id: r.album_id,
                            album_name: r.album_name
                        });
                    }
                }
                callback(photos, error);
            });
        });
    }
}
exports.GeneralDAO_MySQL = GeneralDAO_MySQL;
