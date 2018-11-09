"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator = require("validator");
class Album {
    constructor(id, name, description, id_user, creation_date = new Date(), update_date = new Date()) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.idUser = id_user;
        this._creation_date = creation_date;
        this._update_date = update_date;
    }
    get id() {
        return this._id;
    }
    set id(id) {
        this._id = id;
    }
    get name() {
        return this._name;
    }
    set name(name) {
        this.validateEmpty(name);
        this._name = name;
    }
    get description() {
        return this._description;
    }
    set description(description) {
        this._description = description;
    }
    get idUser() {
        return this._id_user;
    }
    set idUser(id_user) {
        this._id_user = id_user;
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
exports.Album = Album;
