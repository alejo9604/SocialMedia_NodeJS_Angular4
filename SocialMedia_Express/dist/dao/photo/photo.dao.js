"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PhotoDAO {
    constructor(connection) {
        this.connection = connection;
    }
    getConnection() {
        return this.connection;
    }
}
exports.PhotoDAO = PhotoDAO;
