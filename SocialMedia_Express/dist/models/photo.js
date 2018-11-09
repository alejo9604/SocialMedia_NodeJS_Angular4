"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator = require("validator");
class Photo {
    constructor(id, title, description, photo_path, owner) {
        this.id = id;
        this.title = title;
        this.descripton = description;
        this.photoPath = photo_path;
        this._creation_date = new Date();
        this._update_date = new Date();
        this.owner = owner;
    }
    get id() {
        return this._id;
    }
    set id(id) {
        this._id = id;
    }
    get title() {
        return this._title;
    }
    set title(title) {
        this.validateEmpty(title);
        this._title = title;
    }
    get descripton() {
        return this._description;
    }
    set descripton(description) {
        this._description = description;
    }
    get photoPath() {
        return this._photo_path;
    }
    set photoPath(photo_path) {
        this._photo_path = photo_path;
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
    get owner() {
        return this._owner;
    }
    set owner(owner) {
        this._owner = owner;
    }
    validateEmpty(value) {
        if (validator.isEmpty(value)) {
            throw Error("Error data user!");
        }
    }
}
exports.Photo = Photo;
