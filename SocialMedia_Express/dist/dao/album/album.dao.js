"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AlbumDAO {
    constructor(connection) {
        this.connection = connection;
    }
    getConnection() {
        return this.connection;
    }
}
exports.AlbumDAO = AlbumDAO;
