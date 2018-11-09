"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const logger = require("morgan");
const path = require("path");
const dotenv = require("dotenv");
const multer = require("multer");
const passport = require("passport");
const configPassport = require("./config/passport");
configPassport.default(passport);
const errorHandler = require("errorhandler");
const methodOverride = require("method-override");
const index_1 = require("./routes/index");
const album_route_1 = require("./routes/album.route");
const photo_route_1 = require("./routes/photo.route");
const user_route_1 = require("./routes/user.route");
const content_route_1 = require("./routes/content.route");
const general_route_1 = require("./routes/general.route");
class Server {
    static bootstrap() {
        return new Server();
    }
    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.api();
    }
    api() {
    }
    config() {
        dotenv.config({ path: ".env" });
        this.app.use(express.static(path.join(__dirname, "public")));
        this.app.use(express.static('uploads'));
        this.app.set("views", path.join(__dirname, "views"));
        this.app.set("view engine", "pug");
        this.app.use(logger("dev"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(cookieParser("SECRET_GOES_HERE"));
        this.app.use(methodOverride());
        this.app.use(function (err, req, res, next) {
            err.status = 404;
            next(err);
        });
        this.app.use(errorHandler());
    }
    routes() {
        this.app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Accept");
            next();
        });
        let storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './uploads/');
            },
            filename: function (req, file, cb) {
                cb(null, file.filename + '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
            }
        });
        let upload = multer({ storage: storage });
        this.app.post('/updloadPhoto', passport.authenticate('jwt', { session: false }), upload.array("uploads[]"), function (req, res, next) {
            res.send(req['files']);
        });
        this.app.post('/updloadOnePhoto', passport.authenticate('jwt', { session: false }), upload.single('image'), function (req, res, next) {
            res.send(req['files']);
        });
        let storageAvatar = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './uploads/Avatars');
            },
            filename: function (req, file, cb) {
                cb(null, file.filename + '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
            }
        });
        let uploadAvatar = multer({ storage: storageAvatar });
        this.app.post('/updloadAvatar', uploadAvatar.single("avatar"), function (req, res, next) {
            res.send(req['file']);
        });
        let router;
        router = express.Router();
        index_1.IndexRoute.create(router);
        album_route_1.AlbumRoute.create(router);
        photo_route_1.PhotoRoute.create(router);
        user_route_1.UserRoute.create(router);
        content_route_1.ContentRoute.create(router);
        general_route_1.GeneralRoute.create(router);
        this.app.use(router);
    }
}
exports.Server = Server;
