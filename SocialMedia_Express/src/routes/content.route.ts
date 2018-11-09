import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import * as multer from "multer";
import * as validator from "validator";

import { DBManager } from "../dao/dbManager";
import { Photo } from "../models/photo";
import { Album } from "../models/album";

import * as passport from "passport";

import * as configPassport from "../config/passport";
configPassport.default(passport);

/**
 * / route
 *
 * @class ContentRoute
 */
export class ContentRoute extends BaseRoute {

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


    //Excahnge Photo
    router.post("/exchangePhoto",  passport.authenticate('jwt', { session: false}), (req: Request, res: Response, next: NextFunction) => {
      new ContentRoute().exchangePhoto(req, res, next);
    });

    //Insert Photo
    router.post("/addPhotoToAlbum",  passport.authenticate('jwt', { session: false}), (req: Request, res: Response, next: NextFunction) => {
      new ContentRoute().addPhoto(req, res, next);
    });
  }

  /**
   * Constructor
   *
   * @class ContentRoute
   * @constructor
   */
  constructor() {
    super();
  }


  /*
    Exchange Photos
    -params Body:
        *AlbumId          number
        *P1Id             number
        *P1Order          number
        *P2Id             number
        *P2Order          number
        *UserId           number             Change for username!!!!!!!!!!!!!!!
    -response:
        *Photo Array (id, title, description, photo_path, creation_date, update_date, owner)
  */
  public exchangePhoto(req: Request, res: Response, next: NextFunction) {

    if(req.body.userId == undefined || req.body.AlbumId == undefined || req.body.P1Id == undefined ||
       req.body.P1Order == undefined || req.body.P2Id == undefined || req.body.P2Order == undefined){
        res.status(500).json({ error: "Error data!" });

    }else{

      DBManager.getDBMySQL().Content.ExchangePhoto(req.body.AlbumId, req.body.P1Id, req.body.P1Order, req.body.P2Id, req.body.P2Order, (data, error) => {
        if(error){
          res.status(500).json({ error: error });
        }else{
          res.status(200).json(data);
        }
      });

    }

  }



  /*
    addPhoto
    -params Body:
        *albumId          number
        *photoId          number
        *userId           number
    -response:
        *
  */
  public addPhoto(req: Request, res: Response, next: NextFunction) {


    if(req.body.userId == undefined || req.body.albumId == undefined || req.body.photoId == undefined){
        res.status(500).json({ error: "Error data!" });

    }else{

      DBManager.getDBMySQL().Album.GetAlbum(req.body.albumId, (album:Album, error) => {
        if(error){
          res.status(500).json({ error: error });
        }else if(album.idUser != req.body.userId){
          res.status(500).json({ error: "Error data security!" });
        }else{

          DBManager.getDBMySQL().Content.Insert(req.body.albumId, req.body.photoId, (data, error) => {
            if(error){
              if(error.code == "ER_DUP_ENTRY"){
                res.status(505).json({ error: "Alredy exits" });
              }else{
                res.status(500).json({ error: error });
              }
            }else{
              res.status(200).json({ data: data });
            }
          });

        }
      });

    }

  }

}
