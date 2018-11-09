import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";

import { DBManager } from "../dao/dbManager";
import { User } from "../models/user";

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
* @class UserRoute
*/
export class UserRoute extends BaseRoute{


  constructor() {
    super();
  }


  public static create(router: Router) {
    //log
    console.log("[UserRoute::create] Creating index route.");

    //Signup
    router.post("/singUp", (req: Request, res: Response, next: NextFunction) => {
      new UserRoute().singUp(req, res, next);
    });

    //Authenticate - Login
    router.post("/authenticate", (req: Request, res: Response, next: NextFunction) => {
      new UserRoute().authenticate(req, res, next);
    });

    //Get profile
    /*
    (req: Request, res: Response, next: NextFunction) => {
      console.log(req.headers);
      next();
    },
    */
    router.get("/profile/:userId",
     passport.authenticate('jwt', { session: false}),
     (req: Request, res: Response, next: NextFunction) => {
      new UserRoute().profile(req, res, next);
    });

    //Test for JWT validation
    router.get("/memberinfo", passport.authenticate('jwt', { session: false}), (req: Request, res: Response, next: NextFunction) => {
      new UserRoute().memberinfo(req, res, next);
    });

    //Update user
    router.post("/update", passport.authenticate('jwt', { session: false}), (req: Request, res: Response, next: NextFunction) => {
      new UserRoute().update(req, res, next);
    });

    //Update Password
    router.post("/changePassword", passport.authenticate('jwt', { session: false}), (req: Request, res: Response, next: NextFunction) => {
      new UserRoute().changePassword(req, res, next);
    });

    //Get User - Admin
    router.post("/getUsers", passport.authenticate('jwt', { session: false}), (req: Request, res: Response, next: NextFunction) => {
      new UserRoute().getUsers(req, res, next);
    });

    //Update Type
    router.post("/changeType", passport.authenticate('jwt', { session: false}), (req: Request, res: Response, next: NextFunction) => {
      new UserRoute().changeType(req, res, next);
    });

    //Update Type
    router.post("/ceu", passport.authenticate('jwt', { session: false}), (req: Request, res: Response, next: NextFunction) => {
      new UserRoute().CaEditUser(req, res, next);
    });
  }


  /*
    SignUp
    -params Body:
        *Username         string
        *Password         string
        *Name             string
        *email            string
        *Avatar_path      string
    -response:
        *User (id, name, username, password, email, avatar)
  */
  public singUp(req: Request, res: Response, next: NextFunction) {

    if (req.body.name == undefined || req.body.password == undefined || req.body.username == undefined || req.body.email == undefined ||
        validator.isEmpty(req.body.name) || validator.isEmpty(req.body.password) || validator.isEmpty(req.body.username) || validator.isEmpty(req.body.email)) {
      res.status(500).json({ error: "Error data!" });
    } else {
      DBManager.getDBMySQL().User.Insert(req.body.name, req.body.username, req.body.password, req.body.email, req.body.avatar, function(data, error){
        if (error) {
          return res.status(501).json({ error: "Username already exists" });
        }
        res.status(200).json({data: "Successful created new user"});
      });
    }
  }

  /*
    Authenticate - Login
    -params Body:
        *username       string
        *password       string
    -response:
        *JSON {token: jwt}
  */
  public authenticate(req: Request, res: Response, next: NextFunction) {

    if (req.body.username == undefined || req.body.password == undefined ||
        validator.isEmpty(req.body.username) || validator.isEmpty(req.body.password))
      return res.status(500).json({ error: "Error data!" });

    DBManager.getDBMySQL().User.findOne(req.body.username, function(user, error){
      if(error){
        res.status(500).json({ error: error });
      }else{
        user.comparePassword(req.body.password, function (isMatch, err) {

          if (isMatch && !err) {

            let userJWT = {
              id: user.id,
              username: user.username,
              password: user.password,
              IP: requestIp.getClientIp(req),
              date: Date.now()
            }

            // if user is found and password is right create a token
            var token = jwt.encode(userJWT, security.secret.secret);
            // return the information including token as JSON

            DBManager.getDBMySQL().User.CanEditType(user.id, function(canEdit, error){
              if(error){
                res.status(500).json({ error: error });
              }else {
                res.status(200).json({success: true, token: 'jwt ' + token, id: user.id, ce: canEdit});
              }
            });

          } else {
            res.status(500).send({success: false, msg: 'Authentication failed'});
          }
        });
      }
    });
  }

  /*
    Get profile
    -params Body:
        *username
    -response:
        *User (id, name, username, password, email, avatar)
  */
  public profile(req: Request, res: Response, next: NextFunction) {



    if (req.params.userId == undefined)
      return res.status(500).json({ error: "Error data!" });

    DBManager.getDBMySQL().User.findOneById(req.params.userId, function(user, error){
      if(error){
        res.status(500).json({ error: error });
      }else{

        let resUser = {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          avatar_path: user.avatar_path,
          type: user.type
        }

        res.status(200).json({profile: resUser});
      }
    });
  }





  /*
    Test for JWT Validation
  */
  public memberinfo(req: Request, res: Response, next: NextFunction) {
    var token = this.getToken(req.headers);
    if (token) {
      let decoded = jwt.decode(token, security.secret.secret);

      DBManager.getDBMySQL().User.findOne(decoded.username, function(user, error){
        if (error) throw error;

        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
          res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
        }
      });

    } else {
      return res.status(403).send({success: false, msg: 'No token provided.'});
    }
  }

  getToken = function (headers) {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };


  /*
    UpdateUser
    -params Body:
        *Username         string
        *Password         string
        *Name             string
        *email            string
        *Avatar_path      string
    -response:
        *User (id, name, username, password, email, avatar)
  */
  public update(req: Request, res: Response, next: NextFunction) {

    if (req.body.id == undefined || req.body.name == undefined || req.body.username == undefined || req.body.email == undefined ||
        validator.isEmpty(req.body.name) || validator.isEmpty(req.body.username) || validator.isEmpty(req.body.email)) {
      res.status(500).json({ error: "Error data!" });
    } else {
      DBManager.getDBMySQL().User.Update(req.body.id, req.body.name, req.body.username, req.body.email, req.body.avatar, function(data, error){
        if (error) {
          return res.status(501).json({ error: error });
        }
        res.status(200).json({data: "Successful update user"});
      });
    }
  }



  /*
    ChangePassword
    -params Body:
        *userId         number
        *password       string
        *new_password   string
    -response:
        *{succes, error}
  */
  public changePassword(req: Request, res: Response, next: NextFunction) {

    if (req.body.userId == undefined || req.body.password == undefined || req.body.new_password == undefined ||
        validator.isEmpty(req.body.password) || validator.isEmpty(req.body.new_password))
      return res.status(500).json({ error: "Error data!" });

    DBManager.getDBMySQL().User.findOneById(req.body.userId, function(user, error){

      if(error){
        res.status(500).json({ error: error });
      }else{
        user.comparePassword(req.body.password, function (isMatch, err) {

          if (isMatch && !err) {

            DBManager.getDBMySQL().User.UpdatePassword(req.body.userId, req.body.password, req.body.new_password, function(data, error){

              if(error){
                res.status(500).json({ error: error });
              }else{
                res.status(200).json({data: data});
              }
            });

          } else {
            res.status(500).send({success: false, msg: 'Error'});
          }
        });
      }
    });
  }




    /*
      GetUsers
      -params Body:
          *userId         number
      -response:
          *User[]
    */
    public getUsers(req: Request, res: Response, next: NextFunction) {

      if (req.body.userId == undefined)
        return res.status(500).json({ error: "Error data!" });

      DBManager.getDBMySQL().User.CanEditType(req.body.userId, function(canEdit, error){

        if(error){
          res.status(500).json({ error: error });
        }else if(!canEdit){
          res.status(500).json({ error: "Error data security!" });
        }else{

          DBManager.getDBMySQL().User.all( function(data, error){
            if(error){
              res.status(500).json({ error: error });
            }else{
              res.status(200).json({data: data});
            }
          });
          //res.status(500).json({ data: data });
        }
      });
    }



  /*
    ChangeType
    -params Body:
        *userId         number
        *targerId       number
        *new_type       number
    -response:
        *{succes, error}
  */
  public changeType(req: Request, res: Response, next: NextFunction) {

    if (req.body.userId == undefined || req.body.targerId == undefined || req.body.new_type == undefined || req.body.userId == req.body.targerId)
      return res.status(500).json({ error: "Error data!" });

    DBManager.getDBMySQL().User.CanEditType(req.body.userId, function(canEdit, error){

      if(error){
        res.status(500).json({ error: error });
      }else if(!canEdit){
        res.status(500).json({ error: "Error data security!" });
      }else{

        DBManager.getDBMySQL().User.UpdateType(req.body.targerId, req.body.new_type, function(data, error){
          if(error){
            res.status(500).json({ error: error });
          }else{
            res.status(200).json({type: data});
          }
        });
        //res.status(500).json({ data: data });
      }
    });
  }



  public CaEditUser(req: Request, res: Response, next: NextFunction) {
    if (req.body.userId == undefined)
      return res.status(500).json({ error: "Error data!" });

    DBManager.getDBMySQL().User.CanEditType(req.body.userId, function(canEdit, error){

      if(error){
        res.status(500).json({ error: error });
      }
      res.status(200).json({data: canEdit});
    });
  }
}
