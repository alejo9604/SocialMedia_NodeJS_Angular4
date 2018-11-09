"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbAbstract_1 = require("./dbAbstract");
const mysql = require("mysql");
const userdao_mysql_1 = require("./user/userdao_mysql");
const albumdao_mysql_1 = require("./album/albumdao_mysql");
const photodao_mysql_1 = require("./photo/photodao_mysql");
const contentdao_mysql_1 = require("./content/contentdao_mysql");
const generaldao_mysql_1 = require("./general/generaldao_mysql");
class DB_MySQL extends dbAbstract_1.DBAbstract {
    constructor() {
        let connection = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASS,
            database: process.env.MYSQL_DATABASE
        });
        let userDAO = new userdao_mysql_1.UserDAO_MySQL(connection);
        let albumDAO = new albumdao_mysql_1.AlbumDAO_MySQL(connection);
        let photoDAO = new photodao_mysql_1.PhotoDAO_MySQL(connection);
        let contentDAO = new contentdao_mysql_1.ContentDAO_MySQL(connection);
        let generalDAO = new generaldao_mysql_1.GeneralDAO_MySQL(connection);
        super(userDAO, albumDAO, photoDAO, contentDAO, generalDAO);
    }
}
exports.DB_MySQL = DB_MySQL;
