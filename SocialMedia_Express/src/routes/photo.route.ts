import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import * as multer from "multer";
import * as validator from "validator";

import { DBManager } from "../dao/dbManager";
import { Photo } from "../models/photo";

import * as passport from "passport";

import * as configPassport from "../config/passport";
configPassport.default(passport);

/**
 * / route
 *
 * @class PhotoRoute
 */
export class PhotoRoute extends BaseRoute {

  private storage;
  private upload;

  /**
   * Create the routes.
   *
   * @class PhotoRoute
   * @method create
   * @static
   */
  public static create(router: Router) {
    //log
    console.log("[PhotoRoute::create] Creating index route.");


    //Insert Photo
    router.post("/photo",  passport.authenticate('jwt', { session: false}), (req: Request, res: Response, next: NextFunction) => {
      new PhotoRoute().insertPhoto(req, res, next);
    });

    //Update Photo
    router.put("/photo",  passport.authenticate('jwt', { session: false}), (req: Request, res: Response, next: NextFunction) => {
      new PhotoRoute().updatePhoto(req, res, next);
    });

    //Dalete Photo
    router.delete("/photo",  passport.authenticate('jwt', { session: false}), (req: Request, res: Response, next: NextFunction) => {
      new PhotoRoute().photoAlbum(req, res, next);
    });
  }

  /**
   * Constructor
   *
   * @class PhotoRoute
   * @constructor
   */
  constructor() {
    super();
  }


  /*
    Insert Photos
    -params Body:
        *AlbumId          number
        *Photos           JsonArray
        *UserId           number             Change for username!!!!!!!!!!!!!!!
    -response:
        *Photo Array (id, title, description, photo_path, creation_date, update_date, owner)
  */
  public insertPhoto(req: Request, res: Response, next: NextFunction) {


    if(req.body.userId == undefined || req.body.photos == undefined || req.body.albumId == undefined){
        res.status(500).json({ error: "Error data!" });

    }else{

      let photos:Photo[] = [];
      let count = req.body.photos.length;

      for(let p of req.body.photos){

        if(p.title == undefined || p.path == undefined || validator.isEmpty(p.title) || validator.isEmpty(p.path) ){

          count--;
          if(count == 0){
            res.status(500).json({ error: "error count" });
          }
          continue;
        }

        DBManager.getDBMySQL().Photo.Insert(p.title, p.description, p.path, req.body.userId, (data, error) => {
          photos.push(data);
          try{
            this.insertContent(req.body.albumId, data.id);
          }catch(err){
            res.status(500).json({ error: err });
          }

          if(error){
            res.status(500).json({ error: error });
          }

          if(photos.length >= count){
            res.status(200).json(photos);
          }
        });
      }
    }

  }

  /*
    Insert Album
    -params Body:
        *albumId      number
        *photoId      number
    -response:
  */
  private insertContent(albumId:number, photoId:number){
      DBManager.getDBMySQL().Content.Insert(albumId, photoId, (data, error) =>{
        if(error) throw error;
      });
  }


  /*
    Update Photo
    -params Body:
        *Id             number
        *Title          string
        *Description    string
    -response:
        *Photo (id, title, description, photo_path, creation_date, update_date, owner)
  */
  public updatePhoto(req: Request, res: Response, next: NextFunction) {

    if(req.body.id == undefined || req.body.title == undefined || req.body.description == undefined || req.body.userId  == undefined ||
      validator.isEmpty(req.body.title)){
        res.status(500).json({ error: "Error data!" });

    }else{

      DBManager.getDBMySQL().Photo.Update(req.body.id, req.body.title, req.body.description, req.body.userId, (data, error) => {
        if(error){
          res.status(500).json({ error: error });
        }else{
          res.status(200).json(data);
        }
      });
    }
  }

  /*
    Delete Photo
    -params Body:
        *Id             number
        *path           string
        *UserId         number             Change for username!!!!!!!!!!!!!!!
    -response:
        *JSON {res: true/false}
  */
  public photoAlbum(req: Request, res: Response, next: NextFunction) {

    if(req.body.id == undefined || req.body.path == undefined || req.body.userId == undefined ||
      validator.isEmpty(req.body.path)){

      res.status(500).json({ error: "Error data!" });
    }else{

      DBManager.getDBMySQL().Photo.Delete(req.body.id, req.body.path, req.body.userId, (data, error) => {
        if(error){
          res.status(500).json({ error: error });
        }else{
          res.status(200).json(data);
        }
      });
    }
  }

}
