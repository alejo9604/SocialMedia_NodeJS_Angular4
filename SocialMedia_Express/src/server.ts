import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import * as dotenv from "dotenv";
import * as multer from "multer";

import * as passport from "passport";

import * as configPassport from "./config/passport";
configPassport.default(passport);

import errorHandler = require("errorhandler");
import methodOverride = require("method-override");

import { IndexRoute } from "./routes/index";
import { AlbumRoute } from "./routes/album.route";
import { PhotoRoute } from "./routes/photo.route";
import { UserRoute } from "./routes/user.route";
import { ContentRoute } from "./routes/content.route";
import { GeneralRoute } from "./routes/general.route";


/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public app: express.Application;


  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    //create expressjs application
    this.app = express();

    //configure application
    this.config();

    //add routes
    this.routes();

    //add api
    this.api();
  }

  /**
   * Create REST API routes
   *
   * @class Server
   * @method api
   */
  public api() {
    //empty for now
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {

    dotenv.config({ path: ".env" });

    //add static paths
    this.app.use(express.static(path.join(__dirname, "public")));
    //this.app.use(express.static(path.join(__dirname, "uploads")));
    this.app.use(express.static('uploads'));

    //configure pug
    this.app.set("views", path.join(__dirname, "views"));
    this.app.set("view engine", "pug");

    //mount logger
    this.app.use(logger("dev"));

    //mount json form parser
    this.app.use(bodyParser.json());

    //mount query string parser
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));

    //mount cookie parser middleware
    this.app.use(cookieParser("SECRET_GOES_HERE"));

    //mount override?
    this.app.use(methodOverride());

    // catch 404 and forward to error handler
    this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
        err.status = 404;
        next(err);
    });

    //error handling
    this.app.use(errorHandler());
  }

  /**
   * Create and return Router.
   *
   * @class Server
   * @method config
   * @return void
   */
  private routes() {

    this.app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // Request headers you wish to allow
        //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Accept");

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        //res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });

    //Upload File-Images
    let storage = multer.diskStorage({
      // destino del fichero
      destination: function (req, file, cb) {
        cb(null, './uploads/')
      },
      // renombrar fichero
      filename: function (req, file, cb) {
        cb(null, file.filename + '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
      }
    });

    let upload = multer({ storage: storage });

    this.app.post('/updloadPhoto',  passport.authenticate('jwt', { session: false}), upload.array("uploads[]"), function (req, res, next) {
      // req['file'] is the `avatar` file
      // req['body'] will hold the text fields, if there were any
      //console.log('files', req.files);
      //console.log(req['files']);
      //res.json({a: 1});
      //console.log(req['files']);
      res.send(req['files']);
    });

    this.app.post('/updloadOnePhoto',  passport.authenticate('jwt', { session: false}), upload.single('image'), function (req, res, next) {
      // req['file'] is the `avatar` file
      // req['body'] will hold the text fields, if there were any
      //console.log('files', req.files);
      //console.log(req['files']);
      //res.json({a: 1});
      res.send(req['files']);
    });




    /*Avatar*/

    let storageAvatar = multer.diskStorage({
      // destino del fichero
      destination: function (req, file, cb) {
        cb(null, './uploads/Avatars')
      },
      // renombrar fichero
      filename: function (req, file, cb) {
        cb(null, file.filename + '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
      }
    });
    let uploadAvatar = multer({ storage: storageAvatar });
    this.app.post('/updloadAvatar',   uploadAvatar.single("avatar"), function (req, res, next) {
      // req['file'] is the `avatar` file

      //req['file'].filename =
      res.send(req['file']);
    });


    let router: express.Router;
    router = express.Router();

    //Routes
    IndexRoute.create(router);
    AlbumRoute.create(router);
    PhotoRoute.create(router);
    UserRoute.create(router);
    ContentRoute.create(router);
    GeneralRoute.create(router);

    //use router middleware
    this.app.use(router);
  }

}
