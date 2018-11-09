"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GeneralDAO {
    constructor(connection) {
        this.connection = connection;
    }
    getConnection() {
        return this.connection;
    }
}
exports.GeneralDAO = GeneralDAO;
