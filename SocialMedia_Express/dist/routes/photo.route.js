"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = require("./route");
const validator = require("validator");
const dbManager_1 = require("../dao/dbManager");
const passport = require("passport");
const configPassport = require("../config/passport");
configPassport.default(passport);
class PhotoRoute extends route_1.BaseRoute {
    static create(router) {
        console.log("[PhotoRoute::create] Creating index route.");
        router.post("/photo", passport.authenticate('jwt', { session: false }), (req, res, next) => {
            new PhotoRoute().insertPhoto(req, res, next);
        });
        router.put("/photo", passport.authenticate('jwt', { session: false }), (req, res, next) => {
            new PhotoRoute().updatePhoto(req, res, next);
        });
        router.delete("/photo", passport.authenticate('jwt', { session: false }), (req, res, next) => {
            new PhotoRoute().photoAlbum(req, res, next);
        });
    }
    constructor() {
        super();
    }
    insertPhoto(req, res, next) {
        if (req.body.userId == undefined || req.body.photos == undefined || req.body.albumId == undefined) {
            res.status(500).json({ error: "Error data!" });
        }
        else {
            let photos = [];
            let count = req.body.photos.length;
            for (let p of req.body.photos) {
                if (p.title == undefined || p.path == undefined || validator.isEmpty(p.title) || validator.isEmpty(p.path)) {
                    count--;
                    if (count == 0) {
                        res.status(500).json({ error: "error count" });
                    }
                    continue;
                }
                dbManager_1.DBManager.getDBMySQL().Photo.Insert(p.title, p.description, p.path, req.body.userId, (data, error) => {
                    photos.push(data);
                    try {
                        this.insertContent(req.body.albumId, data.id);
                    }
                    catch (err) {
                        res.status(500).json({ error: err });
                    }
                    if (error) {
                        res.status(500).json({ error: error });
                    }
                    if (photos.length >= count) {
                        res.status(200).json(photos);
                    }
                });
            }
        }
    }
    insertContent(albumId, photoId) {
        dbManager_1.DBManager.getDBMySQL().Content.Insert(albumId, photoId, (data, error) => {
            if (error)
                throw error;
        });
    }
    updatePhoto(req, res, next) {
        if (req.body.id == undefined || req.body.title == undefined || req.body.description == undefined || req.body.userId == undefined ||
            validator.isEmpty(req.body.title)) {
            res.status(500).json({ error: "Error data!" });
        }
        else {
            dbManager_1.DBManager.getDBMySQL().Photo.Update(req.body.id, req.body.title, req.body.description, req.body.userId, (data, error) => {
                if (error) {
                    res.status(500).json({ error: error });
                }
                else {
                    res.status(200).json(data);
                }
            });
        }
    }
    photoAlbum(req, res, next) {
        if (req.body.id == undefined || req.body.path == undefined || req.body.userId == undefined ||
            validator.isEmpty(req.body.path)) {
            res.status(500).json({ error: "Error data!" });
        }
        else {
            dbManager_1.DBManager.getDBMySQL().Photo.Delete(req.body.id, req.body.path, req.body.userId, (data, error) => {
                if (error) {
                    res.status(500).json({ error: error });
                }
                else {
                    res.status(200).json(data);
                }
            });
        }
    }
}
exports.PhotoRoute = PhotoRoute;
