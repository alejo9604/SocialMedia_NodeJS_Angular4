"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = require("./route");
const dbManager_1 = require("../dao/dbManager");
const validator = require("validator");
const passport = require("passport");
const jwt = require("jwt-simple");
const security = require("../config/security");
const requestIp = require("request-ip");
const configPassport = require("../config/passport");
configPassport.default(passport);
class UserRoute extends route_1.BaseRoute {
    constructor() {
        super();
        this.getToken = function (headers) {
            if (headers && headers.authorization) {
                var parted = headers.authorization.split(' ');
                if (parted.length === 2) {
                    return parted[1];
                }
                else {
                    return null;
                }
            }
            else {
                return null;
            }
        };
    }
    static create(router) {
        console.log("[UserRoute::create] Creating index route.");
        router.post("/singUp", (req, res, next) => {
            new UserRoute().singUp(req, res, next);
        });
        router.post("/authenticate", (req, res, next) => {
            new UserRoute().authenticate(req, res, next);
        });
        router.get("/profile/:userId", passport.authenticate('jwt', { session: false }), (req, res, next) => {
            new UserRoute().profile(req, res, next);
        });
        router.get("/memberinfo", passport.authenticate('jwt', { session: false }), (req, res, next) => {
            new UserRoute().memberinfo(req, res, next);
        });
        router.post("/update", passport.authenticate('jwt', { session: false }), (req, res, next) => {
            new UserRoute().update(req, res, next);
        });
        router.post("/changePassword", passport.authenticate('jwt', { session: false }), (req, res, next) => {
            new UserRoute().changePassword(req, res, next);
        });
        router.post("/getUsers", passport.authenticate('jwt', { session: false }), (req, res, next) => {
            new UserRoute().getUsers(req, res, next);
        });
        router.post("/changeType", passport.authenticate('jwt', { session: false }), (req, res, next) => {
            new UserRoute().changeType(req, res, next);
        });
        router.post("/ceu", passport.authenticate('jwt', { session: false }), (req, res, next) => {
            new UserRoute().CaEditUser(req, res, next);
        });
    }
    singUp(req, res, next) {
        if (req.body.name == undefined || req.body.password == undefined || req.body.username == undefined || req.body.email == undefined ||
            validator.isEmpty(req.body.name) || validator.isEmpty(req.body.password) || validator.isEmpty(req.body.username) || validator.isEmpty(req.body.email)) {
            res.status(500).json({ error: "Error data!" });
        }
        else {
            dbManager_1.DBManager.getDBMySQL().User.Insert(req.body.name, req.body.username, req.body.password, req.body.email, req.body.avatar, function (data, error) {
                if (error) {
                    return res.status(501).json({ error: "Username already exists" });
                }
                res.status(200).json({ data: "Successful created new user" });
            });
        }
    }
    authenticate(req, res, next) {
        if (req.body.username == undefined || req.body.password == undefined ||
            validator.isEmpty(req.body.username) || validator.isEmpty(req.body.password))
            return res.status(500).json({ error: "Error data!" });
        dbManager_1.DBManager.getDBMySQL().User.findOne(req.body.username, function (user, error) {
            if (error) {
                res.status(500).json({ error: error });
            }
            else {
                user.comparePassword(req.body.password, function (isMatch, err) {
                    if (isMatch && !err) {
                        let userJWT = {
                            id: user.id,
                            username: user.username,
                            password: user.password,
                            IP: requestIp.getClientIp(req),
                            date: Date.now()
                        };
                        var token = jwt.encode(userJWT, security.secret.secret);
                        dbManager_1.DBManager.getDBMySQL().User.CanEditType(user.id, function (canEdit, error) {
                            if (error) {
                                res.status(500).json({ error: error });
                            }
                            else {
                                res.status(200).json({ success: true, token: 'jwt ' + token, id: user.id, ce: canEdit });
                            }
                        });
                    }
                    else {
                        res.status(500).send({ success: false, msg: 'Authentication failed' });
                    }
                });
            }
        });
    }
    profile(req, res, next) {
        if (req.params.userId == undefined)
            return res.status(500).json({ error: "Error data!" });
        dbManager_1.DBManager.getDBMySQL().User.findOneById(req.params.userId, function (user, error) {
            if (error) {
                res.status(500).json({ error: error });
            }
            else {
                let resUser = {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    avatar_path: user.avatar_path,
                    type: user.type
                };
                res.status(200).json({ profile: resUser });
            }
        });
    }
    memberinfo(req, res, next) {
        var token = this.getToken(req.headers);
        if (token) {
            let decoded = jwt.decode(token, security.secret.secret);
            dbManager_1.DBManager.getDBMySQL().User.findOne(decoded.username, function (user, error) {
                if (error)
                    throw error;
                if (!user) {
                    return res.status(403).send({ success: false, msg: 'Authentication failed. User not found.' });
                }
                else {
                    res.json({ success: true, msg: 'Welcome in the member area ' + user.name + '!' });
                }
            });
        }
        else {
            return res.status(403).send({ success: false, msg: 'No token provided.' });
        }
    }
    update(req, res, next) {
        if (req.body.id == undefined || req.body.name == undefined || req.body.username == undefined || req.body.email == undefined ||
            validator.isEmpty(req.body.name) || validator.isEmpty(req.body.username) || validator.isEmpty(req.body.email)) {
            res.status(500).json({ error: "Error data!" });
        }
        else {
            dbManager_1.DBManager.getDBMySQL().User.Update(req.body.id, req.body.name, req.body.username, req.body.email, req.body.avatar, function (data, error) {
                if (error) {
                    return res.status(501).json({ error: error });
                }
                res.status(200).json({ data: "Successful update user" });
            });
        }
    }
    changePassword(req, res, next) {
        if (req.body.userId == undefined || req.body.password == undefined || req.body.new_password == undefined ||
            validator.isEmpty(req.body.password) || validator.isEmpty(req.body.new_password))
            return res.status(500).json({ error: "Error data!" });
        dbManager_1.DBManager.getDBMySQL().User.findOneById(req.body.userId, function (user, error) {
            if (error) {
                res.status(500).json({ error: error });
            }
            else {
                user.comparePassword(req.body.password, function (isMatch, err) {
                    if (isMatch && !err) {
                        dbManager_1.DBManager.getDBMySQL().User.UpdatePassword(req.body.userId, req.body.password, req.body.new_password, function (data, error) {
                            if (error) {
                                res.status(500).json({ error: error });
                            }
                            else {
                                res.status(200).json({ data: data });
                            }
                        });
                    }
                    else {
                        res.status(500).send({ success: false, msg: 'Error' });
                    }
                });
            }
        });
    }
    getUsers(req, res, next) {
        if (req.body.userId == undefined)
            return res.status(500).json({ error: "Error data!" });
        dbManager_1.DBManager.getDBMySQL().User.CanEditType(req.body.userId, function (canEdit, error) {
            if (error) {
                res.status(500).json({ error: error });
            }
            else if (!canEdit) {
                res.status(500).json({ error: "Error data security!" });
            }
            else {
                dbManager_1.DBManager.getDBMySQL().User.all(function (data, error) {
                    if (error) {
                        res.status(500).json({ error: error });
                    }
                    else {
                        res.status(200).json({ data: data });
                    }
                });
            }
        });
    }
    changeType(req, res, next) {
        if (req.body.userId == undefined || req.body.targerId == undefined || req.body.new_type == undefined || req.body.userId == req.body.targerId)
            return res.status(500).json({ error: "Error data!" });
        dbManager_1.DBManager.getDBMySQL().User.CanEditType(req.body.userId, function (canEdit, error) {
            if (error) {
                res.status(500).json({ error: error });
            }
            else if (!canEdit) {
                res.status(500).json({ error: "Error data security!" });
            }
            else {
                dbManager_1.DBManager.getDBMySQL().User.UpdateType(req.body.targerId, req.body.new_type, function (data, error) {
                    if (error) {
                        res.status(500).json({ error: error });
                    }
                    else {
                        res.status(200).json({ type: data });
                    }
                });
            }
        });
    }
    CaEditUser(req, res, next) {
        if (req.body.userId == undefined)
            return res.status(500).json({ error: "Error data!" });
        dbManager_1.DBManager.getDBMySQL().User.CanEditType(req.body.userId, function (canEdit, error) {
            if (error) {
                res.status(500).json({ error: error });
            }
            res.status(200).json({ data: canEdit });
        });
    }
}
exports.UserRoute = UserRoute;
