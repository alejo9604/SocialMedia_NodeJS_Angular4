"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_dao_1 = require("./user.dao");
const user_1 = require("../../models/user");
class UserDAO_MySQL extends user_dao_1.UserDAO {
    constructor(connection) {
        super(connection);
    }
    all(callback) {
        let users = [];
        this.getConnection().getConnection(function (err, connection) {
            connection.query('SELECT * FROM `photoApp`.`users`;', function (error, results, fields) {
                connection.release();
                for (let r of results) {
                    users.push(new user_1.User(r.id, r.name, r.username, r.password, r.email, r.avatar_path, r.id_type));
                }
                callback(users, error);
            });
        });
    }
    findOne(username, callback) {
        let query = "SELECT `users`.`id`, `users`.`name`, `users`.`username`, `users`.`password`, `users`.`email`, `users`.`avatar_path`, `users`.`id_type` FROM `photoApp`.`users` WHERE `users`.`username` = "
            + this.getConnection().escape(username)
            + ";";
        this.getConnection().getConnection(function (err, connection) {
            connection.query(query, function (error, results, fields) {
                connection.release();
                if (error) {
                    return callback(null, error);
                }
                if (results.length <= 0)
                    return callback(null, { error: "No found" });
                let user = new user_1.User(results[0].id, results[0].name, results[0].username, results[0].password, results[0].email, results[0].avatar_path, results[0].id_type);
                callback(user, error);
            });
        });
    }
    findOneById(userId, callback) {
        let query = "SELECT `users`.`id`, `users`.`name`, `users`.`username`, `users`.`password`, `users`.`email`, `users`.`avatar_path`, `users`.`id_type` FROM `photoApp`.`users` WHERE `users`.`id` = "
            + this.getConnection().escape(userId)
            + ";";
        this.getConnection().getConnection(function (err, connection) {
            connection.query(query, function (error, results, fields) {
                connection.release();
                if (error) {
                    return callback(null, error);
                }
                if (results.length <= 0)
                    return callback(null, { error: "No found" });
                let user = new user_1.User(results[0].id, results[0].name, results[0].username, results[0].password, results[0].email, results[0].avatar_path, results[0].id_type);
                callback(user, error);
            });
        });
    }
    Insert(name, username, password, email, avatar_path, callback) {
        let user = new user_1.User(0, name, username, password, email, avatar_path, 1);
        let conn = this.getConnection();
        user_1.User.hashPassword(user.password, function (pass, error) {
            if (error) {
                return callback(null, error);
            }
            user.password = pass;
            var query = "INSERT INTO `photoApp`.`users` (`name`, `username`, `password`, `email`, `avatar_path`) VALUES ( "
                + conn.escape(user.name) + ", "
                + conn.escape(user.username) + ", "
                + conn.escape(user.password) + ", "
                + conn.escape(user.email) + ", "
                + conn.escape(user.avatar_path) + " );";
            conn.getConnection(function (err, connection) {
                connection.query(query, function (error, results, fields) {
                    connection.release();
                    if (error) {
                        console.log(error);
                        console.log("User.Insert - Error whit user" + user.name);
                        return callback(null, error);
                    }
                    user.id = results.insertId;
                    callback(user, error);
                });
            });
        });
    }
    Update(id, name, username, email, avatar_path, callback) {
        let user = new user_1.User(id, name, username, "NA", email, avatar_path, 1);
        let conn = this.getConnection();
        var query = "UPDATE `photoApp`.`users` SET "
            + "`name` = " + conn.escape(user.name) + ", "
            + "`email` = " + conn.escape(user.email) + ", "
            + "`avatar_path` = " + conn.escape(user.avatar_path) + " "
            + "WHERE "
            + "`id` = " + conn.escape(user.id) + " AND "
            + "`username` = " + conn.escape(user.username) + ";";
        conn.getConnection(function (err, connection) {
            connection.query(query, function (error, results, fields) {
                connection.release();
                if (error) {
                    console.log(error);
                    console.log("User.Update - Error whit user" + user.name);
                    return callback(null, error);
                }
                callback(user, error);
            });
        });
    }
    UpdatePassword(id, password, new_password, callback) {
        if (!user_1.User.testPassword(new_password)) {
            return callback(false, { error: "Error data security!" });
        }
        let conn = this.getConnection();
        user_1.User.hashPassword(new_password, function (pass, error) {
            if (error) {
                return callback(false, error);
            }
            var query = "UPDATE `photoApp`.`users` SET "
                + "`password` = " + conn.escape(pass) + " "
                + "WHERE "
                + "`id` = " + conn.escape(id) + ";";
            conn.getConnection(function (err, connection) {
                connection.query(query, function (error, results, fields) {
                    connection.release();
                    if (error) {
                        console.log("User.UpdatePassword - Error whit user" + id);
                        callback(null, error);
                    }
                    callback(true, error);
                });
            });
        });
    }
    CanSeePhotos(id, callback) {
        let conn = this.getConnection();
        var query = "SELECT type_user.canSeePhotos FROM photoApp.users, photoApp.type_user WHERE users.id_type = type_user.id AND "
            + "users.id = " + conn.escape(id) + ";";
        conn.getConnection(function (err, connection) {
            connection.query(query, function (error, results, fields) {
                connection.release();
                if (error) {
                    console.log(error);
                    console.log("User.CanSeePhotos - Error whit user - " + id);
                    return callback(null, error);
                }
                else if (results.length === 0) {
                    console.log("User.CanSeePhotos - Error whit user" + id);
                    return callback(null, { error: "Error data security!" });
                }
                callback(!!results[0].canSeePhotos, error);
            });
        });
    }
    isSameType(id1, id2, callback) {
        let conn = this.getConnection();
        var query = "SELECT u2.* FROM photoApp.users u1, photoApp.users u2 WHERE "
            + "u1.id = " + conn.escape(id1) + " AND "
            + "u2.id = " + conn.escape(id2) + " AND "
            + "u1.id_type = u2.id_type;";
        conn.getConnection(function (err, connection) {
            connection.query(query, function (error, results, fields) {
                connection.release();
                if (error) {
                    console.log(error);
                    console.log("User.isSameType - Error whit user - " + id1 + " and " + id2);
                    return callback(null, error);
                }
                else if (results.length === 0) {
                    return callback(false, error);
                }
                callback(true, error);
            });
        });
    }
    CanEditType(id, callback) {
        let conn = this.getConnection();
        var query = "SELECT type_user.canEditType FROM photoApp.users, photoApp.type_user WHERE users.id_type = type_user.id AND "
            + "users.id = " + conn.escape(id) + ";";
        conn.getConnection(function (err, connection) {
            connection.query(query, function (error, results, fields) {
                connection.release();
                if (error) {
                    console.log(error);
                    console.log("User.CanEditType - Error whit user - " + id);
                    return callback(null, error);
                }
                else if (results.length === 0) {
                    console.log("User.CanEditType - Error whit user" + id);
                    return callback(null, { error: "Error data security!" });
                }
                callback(!!results[0].canEditType, error);
            });
        });
    }
    UpdateType(id, new_type, callback) {
        let conn = this.getConnection();
        var query = "UPDATE `photoApp`.`users` JOIN `photoApp`.`type_user` ON "
            + "users.id = " + conn.escape(id) + " AND "
            + "type_user.id = " + conn.escape(new_type) + " "
            + "SET users.id_type = type_user.id;";
        conn.getConnection(function (err, connection) {
            connection.query(query, function (error, results, fields) {
                connection.release();
                if (error) {
                    console.log(error);
                    console.log("User.UpdateType - Error whit user" + id);
                    return callback(null, error);
                }
                else if (results.affectedRows == 0) {
                    console.log("User.UpdateType - Error whit user" + id);
                    return callback(null, { error: "Error data on Update!" });
                }
                callback(new_type, error);
            });
        });
    }
}
exports.UserDAO_MySQL = UserDAO_MySQL;
