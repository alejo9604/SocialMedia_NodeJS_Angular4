"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const person_1 = require("./person");
const bcrypt = require("bcrypt-nodejs");
class User extends person_1.Person {
    constructor(id, name, username, password, email, avatar_path, type) {
        super(id, name);
        this.comparePassword = function (passw, callback) {
            bcrypt.compare(passw, this.password, function (err, isMatch) {
                if (err) {
                    return callback(null, err);
                }
                callback(isMatch, null);
            });
        };
        this.username = username;
        this.password = password;
        this.email = email;
        this.avatar_path = avatar_path;
        this._type = type;
    }
    get username() {
        return this._username;
    }
    set username(username) {
        this.validateEmpty(username);
        this._username = username;
    }
    get password() {
        return this._password;
    }
    set password(password) {
        this.validateEmpty(password);
        this._password = password;
    }
    get email() {
        return this._email;
    }
    set email(email) {
        this.validateEmpty(email);
        if (!User.emailRE.test(email)) {
            throw Error("Error data security!");
        }
        this._email = email;
    }
    get avatar_path() {
        return this._avatar_path;
    }
    set avatar_path(avatar_path) {
        this._avatar_path = avatar_path;
    }
    get type() {
        return this._type;
    }
    set type(type) {
        this._type = type;
    }
    static testPassword(passw) {
        if (User.passRE.test(passw)) {
            return true;
        }
        return false;
    }
    static hashPassword(passw, callback) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                console.log(err);
                return callback(null, { erro: 'bcrypt salt' });
            }
            bcrypt.hash(passw, salt, null, function (err, hash) {
                if (err) {
                    console.log(err);
                    callback(null, { erro: 'bcrypt hash' });
                }
                else {
                    callback(hash, null);
                }
            });
        });
    }
}
User.passRE = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$");
User.emailRE = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$");
exports.User = User;
