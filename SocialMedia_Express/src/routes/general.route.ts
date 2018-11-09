import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";

import { DBManager } from "../dao/dbManager";

import * as validator from "validator";
import * as passport from "passport";
import * as jwt from "jwt-simple";
import * as security from "../config/security"
import * as requestIp from "request-ip";

// pass passport for configuration
import * as configPassport from "../config/passport";
configPassport.default(passport);

/**
* / route
*
* @class GeneralRoute
*/
export class GeneralRoute extends BaseRoute{


  constructor() {
    super();
  }


  public static create(router: Router) {
    //log
    console.log("[GeneralRoute::create] Creating index route.");

    //Home
    router.post("/home", passport.authenticate('jwt', { session: false}), (req: Request, res: Response, next: NextFunction) => {
      new GeneralRoute().home(req, res, next);
    });
  }


  /*
    Home
    -params Body:
        *user_id      number
        *from         number (Numero que indica desde cual empezar a contar)
    -response:
        *User (id, name, username, password, email, avatar)
  */
  public home(req: Request, res: Response, next: NextFunction) {

    if (req.body.user_id == undefined) {
      res.status(500).json({ error: "Error data!" });

    } else {

      let from:number = 0;
      if(req.body.from != undefined && (+req.body.from) > 0){
         from = (+req.body.from);
      }

      DBManager.getDBMySQL().User.findOneById(req.body.user_id, function(user, error){
        if (error) {
          return res.status(501).json({ error: error });
        }

        DBManager.getDBMySQL().User.CanSeePhotos(req.body.user_id, function(can, error){
          if (error) {
            return res.status(500).json({ error: error });
          }

          

          DBManager.getDBMySQL().General.Home(user.id, user.type, from, can, function(data, error){
            if (error) {
              return res.status(500).json({ error: error });
            }
            res.status(200).json({data: data});
          });
        });

      });

    }
  }

}
