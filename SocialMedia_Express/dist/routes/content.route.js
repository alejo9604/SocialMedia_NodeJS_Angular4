"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = require("./route");
const dbManager_1 = require("../dao/dbManager");
const passport = require("passport");
const configPassport = require("../config/passport");
configPassport.default(passport);
class ContentRoute extends route_1.BaseRoute {
    static create(router) {
        console.log("[PhotoRoute::create] Creating index route.");
        router.post("/exchangePhoto", passport.authenticate('jwt', { session: false }), (req, res, next) => {
            new ContentRoute().exchangePhoto(req, res, next);
        });
        router.post("/addPhotoToAlbum", passport.authenticate('jwt', { session: false }), (req, res, next) => {
            new ContentRoute().addPhoto(req, res, next);
        });
    }
    constructor() {
        super();
    }
    exchangePhoto(req, res, next) {
        if (req.body.userId == undefined || req.body.AlbumId == undefined || req.body.P1Id == undefined ||
            req.body.P1Order == undefined || req.body.P2Id == undefined || req.body.P2Order == undefined) {
            res.status(500).json({ error: "Error data!" });
        }
        else {
            dbManager_1.DBManager.getDBMySQL().Content.ExchangePhoto(req.body.AlbumId, req.body.P1Id, req.body.P1Order, req.body.P2Id, req.body.P2Order, (data, error) => {
                if (error) {
                    res.status(500).json({ error: error });
                }
                else {
                    res.status(200).json(data);
                }
            });
        }
    }
    addPhoto(req, res, next) {
        if (req.body.userId == undefined || req.body.albumId == undefined || req.body.photoId == undefined) {
            res.status(500).json({ error: "Error data!" });
        }
        else {
            dbManager_1.DBManager.getDBMySQL().Album.GetAlbum(req.body.albumId, (album, error) => {
                if (error) {
                    res.status(500).json({ error: error });
                }
                else if (album.idUser != req.body.userId) {
                    res.status(500).json({ error: "Error data security!" });
                }
                else {
                    dbManager_1.DBManager.getDBMySQL().Content.Insert(req.body.albumId, req.body.photoId, (data, error) => {
                        if (error) {
                            if (error.code == "ER_DUP_ENTRY") {
                                res.status(505).json({ error: "Alredy exits" });
                            }
                            else {
                                res.status(500).json({ error: error });
                            }
                        }
                        else {
                            res.status(200).json({ data: data });
                        }
                    });
                }
            });
        }
    }
}
exports.ContentRoute = ContentRoute;
