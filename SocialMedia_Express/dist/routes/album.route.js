"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = require("./route");
const dbManager_1 = require("../dao/dbManager");
const validator = require("validator");
const passport = require("passport");
const configPassport = require("../config/passport");
configPassport.default(passport);
class AlbumRoute extends route_1.BaseRoute {
    constructor() {
        super();
    }
    static create(router) {
        console.log("[AlbumRoute::create] Creating index route.");
        router.post("/album", passport.authenticate('jwt', { session: false }), (req, res, next) => {
            new AlbumRoute().insertAlbum(req, res, next);
        });
        router.put("/album", passport.authenticate('jwt', { session: false }), (req, res, next) => {
            new AlbumRoute().updateAlbum(req, res, next);
        });
        router.delete("/album", passport.authenticate('jwt', { session: false }), (req, res, next) => {
            new AlbumRoute().deleteAlbum(req, res, next);
        });
        router.get("/albums/:userId", passport.authenticate('jwt', { session: false }), (req, res, next) => {
            new AlbumRoute().getAlbums(req, res, next);
        });
        router.get("/album/:albumId", passport.authenticate('jwt', { session: false }), (req, res, next) => {
            new AlbumRoute().getAlbum(req, res, next);
        });
    }
    insertAlbum(req, res, next) {
        if (req.body.name == undefined || req.body.description == undefined || !req.body.userId == undefined ||
            validator.isEmpty(req.body.name)) {
            res.status(500).json({ error: "Error data!" });
        }
        else {
            dbManager_1.DBManager.getDBMySQL().Album.Insert(req.body.name, req.body.description, req.body.userId, (data, error) => {
                if (error) {
                    res.status(500).json({ error: error });
                }
                else {
                    res.status(200).json(data);
                }
            });
        }
    }
    updateAlbum(req, res, next) {
        if (req.body.id == undefined || req.body.name == undefined || req.body.description == undefined || req.body.userId == undefined ||
            validator.isEmpty(req.body.name)) {
            res.status(500).json({ error: "Error data!" });
        }
        else {
            dbManager_1.DBManager.getDBMySQL().Album.Update(req.body.id, req.body.name, req.body.description, req.body.userId, (data, error) => {
                if (error) {
                    res.status(500).json({ error: error });
                }
                else {
                    res.status(200).json(data);
                }
            });
        }
    }
    deleteAlbum(req, res, next) {
        if (req.body.id == undefined || req.body.name == undefined || req.body.userId == undefined ||
            validator.isEmpty(req.body.name)) {
            res.status(500).json({ error: "Error data!" });
        }
        else {
            dbManager_1.DBManager.getDBMySQL().Album.Delete(req.body.id, req.body.name, req.body.userId, (data, error) => {
                if (error) {
                    res.status(500).json({ error: error });
                }
                else {
                    res.status(200).json(data);
                }
            });
        }
    }
    getAlbums(req, res, next) {
        if (req.params.userId == undefined) {
            res.status(500).json({ error: "Error data!" });
        }
        else {
            dbManager_1.DBManager.getDBMySQL().Album.AllByUserId(req.params.userId, (data, err) => {
                if (err) {
                    res.status(500).json(err);
                }
                else {
                    this.getContentPreview(data, (data2, err2) => {
                        if (err2) {
                            res.status(500).json(err2);
                        }
                        else {
                            res.json(data2);
                        }
                    });
                }
            });
        }
    }
    getContentPreview(albums, callback) {
        let json = [];
        for (let a of albums) {
            dbManager_1.DBManager.getDBMySQL().Content.AllByAlbumID(a.id, 6, (data, err) => {
                if (err) {
                    callback(json, err);
                }
                else {
                    let temp = {
                        id: a.id,
                        name: a.name,
                        description: a.description,
                        creation_date: a.creationDate,
                        update_date: a.updateDate,
                        preview: eval(JSON.stringify(data))
                    };
                    json.push(temp);
                    if (json.length == albums.length) {
                        callback(json, err);
                    }
                }
            });
        }
    }
    getAlbum(req, res, next) {
        if (!req.params.albumId || req.query.userId == undefined) {
            res.status(500).json({ error: "Error data!" });
        }
        else {
            dbManager_1.DBManager.getDBMySQL().Album.GetAlbum(req.params.albumId, (album, error) => {
                if (error) {
                    res.status(500).json({ error: error });
                }
                else {
                    this.canSeeAlbum(album.id, album.idUser, req.query.userId, (can, err2) => {
                        if (err2) {
                            res.status(500).json(err2);
                        }
                        else if (!can) {
                            res.status(500).json({ error: "Error data security!" });
                        }
                        else {
                            this.getContentPhoto(album, (data2, err2) => {
                                if (err2) {
                                    res.status(500).json(err2);
                                }
                                else {
                                    res.status(200).json(data2);
                                }
                            });
                        }
                    });
                }
            });
        }
    }
    canSeeAlbum(albumId, albumOwner, userId, callback) {
        if (albumOwner == userId) {
            callback(true, null);
        }
        else {
            dbManager_1.DBManager.getDBMySQL().User.isSameType(albumOwner, userId, (isSame, err) => {
                if (err) {
                    callback(false, err);
                }
                else if (isSame) {
                    callback(true, err);
                }
                else {
                    dbManager_1.DBManager.getDBMySQL().User.CanSeePhotos(userId, (can, err) => {
                        if (err) {
                            callback(false, err);
                        }
                        else {
                            callback(can, err);
                        }
                    });
                }
            });
        }
    }
    getContentPhoto(album, callback) {
        let json = {};
        dbManager_1.DBManager.getDBMySQL().Content.AllByAlbumID(album.id, 0, (data, err) => {
            json = {};
            if (err) {
                console.log("Error in Get album/getContentPhoto");
            }
            else {
                json = {
                    id: album.id,
                    name: album.name,
                    description: album.description,
                    creation_date: album.creationDate,
                    update_date: album.updateDate,
                    preview: eval(JSON.stringify(data))
                };
            }
            callback(json, err);
        });
    }
}
exports.AlbumRoute = AlbumRoute;
