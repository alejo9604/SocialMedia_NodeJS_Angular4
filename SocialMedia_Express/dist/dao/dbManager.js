"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbMySQL_1 = require("./dbMySQL");
class DBManager {
    static getDB(type = "MySQL") {
        if (type == DBManager.MySQL) {
            return this.getDBMySQL();
        }
        return null;
    }
    static getDBMySQL() {
        if (this._dbMySQL == null) {
            this._dbMySQL = new dbMySQL_1.DB_MySQL();
        }
        return this._dbMySQL;
    }
}
DBManager.MySQL = "MySQL";
DBManager._dbMySQL = null;
exports.DBManager = DBManager;
