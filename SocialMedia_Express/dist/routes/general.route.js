"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = require("./route");
const dbManager_1 = require("../dao/dbManager");
const passport = require("passport");
const configPassport = require("../config/passport");
configPassport.default(passport);
class GeneralRoute extends route_1.BaseRoute {
    constructor() {
        super();
    }
    static create(router) {
        console.log("[GeneralRoute::create] Creating index route.");
        router.post("/home", passport.authenticate('jwt', { session: false }), (req, res, next) => {
            new GeneralRoute().home(req, res, next);
        });
    }
    home(req, res, next) {
        if (req.body.user_id == undefined) {
            res.status(500).json({ error: "Error data!" });
        }
        else {
            let from = 0;
            if (req.body.from != undefined && (+req.body.from) > 0) {
                from = (+req.body.from);
            }
            dbManager_1.DBManager.getDBMySQL().User.findOneById(req.body.user_id, function (user, error) {
                if (error) {
                    return res.status(501).json({ error: error });
                }
                dbManager_1.DBManager.getDBMySQL().User.CanSeePhotos(req.body.user_id, function (can, error) {
                    if (error) {
                        return res.status(500).json({ error: error });
                    }
                    dbManager_1.DBManager.getDBMySQL().General.Home(user.id, user.type, from, can, function (data, error) {
                        if (error) {
                            return res.status(500).json({ error: error });
                        }
                        res.status(200).json({ data: data });
                    });
                });
            });
        }
    }
}
exports.GeneralRoute = GeneralRoute;
