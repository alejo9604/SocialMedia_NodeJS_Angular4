"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ContentDAO {
    constructor(connection) {
        this.connection = connection;
    }
    getConnection() {
        return this.connection;
    }
}
exports.ContentDAO = ContentDAO;
