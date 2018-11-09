"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DBAbstract {
    constructor(UserDAO, AlbumDAO, PhotoDAO, ContentDAO, GeneralDAO) {
        this._UserDAO = UserDAO;
        this._AlbumDAO = AlbumDAO;
        this._PhotoDAO = PhotoDAO;
        this._ContentDAO = ContentDAO;
        this._GeneralDAO = GeneralDAO;
    }
    get User() {
        return this._UserDAO;
    }
    get Album() {
        return this._AlbumDAO;
    }
    get Photo() {
        return this._PhotoDAO;
    }
    get Content() {
        return this._ContentDAO;
    }
    get General() {
        return this._GeneralDAO;
    }
}
exports.DBAbstract = DBAbstract;
