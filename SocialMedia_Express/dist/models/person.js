"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator = require("validator");
class Person {
    constructor(id, name) {
        this._id = id;
        this._name = name;
    }
    get name() {
        return this._name;
    }
    set name(name) {
        this.validateEmpty(name);
        this._name = name;
    }
    get id() {
        return this._id;
    }
    set id(id) {
        this._id = id;
    }
    validateEmpty(value) {
        if (validator.isEmpty(value)) {
            throw Error("Error data user!");
        }
    }
}
exports.Person = Person;
