"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserDAO {
    constructor(connection) {
        this.connection = connection;
    }
    getConnection() {
        return this.connection;
    }
}
exports.UserDAO = UserDAO;
