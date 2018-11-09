"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator = require("validator");
class Content {
    constructor(id_album, id_photo, order) {
        this.idAlbum = id_album;
        this.idPhoto = id_photo;
        this.order = order;
        this._creation_date = new Date();
        this._update_date = new Date();
    }
    get idAlbum() {
        return this._id_album;
    }
    set idAlbum(id_album) {
        this._id_album = id_album;
    }
    get idPhoto() {
        return this._id_photo;
    }
    set idPhoto(id_photo) {
        this._id_photo = id_photo;
    }
    get order() {
        return this._order;
    }
    set order(order) {
        this._order = order;
    }
    get creationDate() {
        return this._creation_date;
    }
    set creationDate(creation_date) {
        this._creation_date = creation_date;
    }
    get updateDate() {
        return this._update_date;
    }
    set updateDate(update_date) {
        this._update_date = update_date;
    }
    validateEmpty(value) {
        if (validator.isEmpty(value)) {
            throw Error("Error data user!");
        }
    }
}
exports.Content = Content;
