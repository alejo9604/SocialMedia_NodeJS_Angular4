import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";

import { DBManager } from "../dao/dbManager";
import { Album } from "../models/album";

import * as validator from "validator";
import * as passport from "passport";

import * as configPassport from "../config/passport";
configPassport.default(passport);

/**
* / route
*
* @class Album Route
*/
export class AlbumRoute extends BaseRoute{


  constructor() {
    super();
  }


  public static create(router: Router) {
    //log
    console.log("[AlbumRoute::create] Creating index route.");


    //, passport.authenticate('jwt', { session: false})

    //Insert Album
    router.post("/album", passport.authenticate('jwt', { session: false}), (req: Request, res: Response, next: NextFunction) => {
      new AlbumRoute().insertAlbum(req, res, next);
    });

    //Update Album
    router.put("/album", passport.authenticate('jwt', { session: false}), (req: Request, res: Response, next: NextFunction) => {
      new AlbumRoute().updateAlbum(req, res, next);
    });

    //Delete Album
    router.delete("/album", passport.authenticate('jwt', { session: false}), (req: Request, res: Response, next: NextFunction) => {
      new AlbumRoute().deleteAlbum(req, res, next);
    });

    //Get User Albums
    router.get("/albums/:userId", passport.authenticate('jwt', { session: false}), (req: Request, res: Response, next: NextFunction) => {
      new AlbumRoute().getAlbums(req, res, next);
    });

    //Get Album
    router.get("/album/:albumId", passport.authenticate('jwt', { session: false}), (req: Request, res: Response, next: NextFunction) => {
      new AlbumRoute().getAlbum(req, res, next);
    });
  }


  /*
    Insert Album
    -params Body:
        *Name           string
        *Description    string
        *UserId         number             Change for username!!!!!!!!!!!!!!!
    -response:
        *Album (id, name, description, userId, creation_date, update_date)
  */
  public insertAlbum(req: Request, res: Response, next: NextFunction) {


    if(req.body.name == undefined || req.body.description == undefined || !req.body.userId == undefined ||
      validator.isEmpty(req.body.name)){

        res.status(500).json({ error: "Error data!" });

    }else{



      DBManager.getDBMySQL().Album.Insert(req.body.name, req.body.description, req.body.userId, (data, error) => {
        if(error){
          res.status(500).json({ error: error });
        }else{
          res.status(200).json(data);
        }

      });
    }
  }

  /*
    Update Album
    -params Body:
        *id             number
        *Name           string
        *Description    string
        *UserId         number             Change for username!!!!!!!!!!!!!!!
    -response:
        *Album (id, name, description, userId, creation_date, update_date)
  */
  public updateAlbum(req: Request, res: Response, next: NextFunction) {

    if(req.body.id == undefined || req.body.name == undefined || req.body.description == undefined || req.body.userId == undefined ||
      validator.isEmpty(req.body.name)){

        res.status(500).json({ error: "Error data!" });
      }else{

        DBManager.getDBMySQL().Album.Update(req.body.id, req.body.name, req.body.description, req.body.userId, (data, error) => {
          if(error){
            res.status(500).json({ error: error });
          }else{
            res.status(200).json(data);
          }
        });
      }
    }

    /*
      Delete Album
      -params Body:
          *Id         number
          *Name       string
          *UserId     number            Change for username!!!!!!!!!!!!!!!
      -response:
          *{res: true/false}
    */
    public deleteAlbum(req: Request, res: Response, next: NextFunction) {

      if(req.body.id == undefined || req.body.name == undefined || req.body.userId == undefined ||
        validator.isEmpty(req.body.name)){

        res.status(500).json({ error: "Error data!" });
      }else{

        DBManager.getDBMySQL().Album.Delete(req.body.id, req.body.name, req.body.userId, (data, error) => {
          if(error){
            res.status(500).json({ error: error });
          }else{
            res.status(200).json(data);
          }
        });
      }
    }

    /*
    Get User Albums
      -params Params:
          *UserId         number             Change for username!!!!!!!!!!!!!!!
      -response:
          *JSON Array:
            id, name, description, userId, creation_date, update_date, preview
    */
    public getAlbums(req: Request, res: Response, next: NextFunction) {
      if(req.params.userId == undefined){
        res.status(500).json({ error: "Error data!" });
      }else{
        DBManager.getDBMySQL().Album.AllByUserId(req.params.userId, (data, err) => {
          if(err){
            res.status(500).json(err);
          }else{
            this.getContentPreview(data, ( data2, err2 )=>{
              if(err2){
                res.status(500).json(err2);
              }else{
                res.json(data2);
              }
            });
          }
        });
      }
    }


    /*
    Get Albums photo
    -params Body:
        *Album Array (id, name, description, userId, creation_date, update_date)
    -response:
        *JSON Array:
          id, name, description, userId, creation_date, update_date, preview
    */
    private getContentPreview( albums:Album[], callback: (data, err) => void ){

      let json = [];

      for( let a of albums){
        DBManager.getDBMySQL().Content.AllByAlbumID( a.id, 6, (data, err) => {
          if(err){
            callback(json, err);
          }else{

            let temp = {
              id: a.id,
              name: a.name,
              description: a.description,
              creation_date: a.creationDate,
              update_date: a.updateDate,
              preview: eval(JSON.stringify(data))
            }

            json.push(temp);

            if(json.length == albums.length){
              callback(json, err);
            }
          }
        });
      }
    }


    /*
      Get Album
      -params Params:
          *Id           number
          *userId       number
      -response:
          *JSON:
            id, name, description, userId, creation_date, update_date, preview
    */
    public getAlbum(req: Request, res: Response, next: NextFunction) {


      if(!req.params.albumId || req.query.userId == undefined){
        res.status(500).json({ error: "Error data!" });
      }else{
        DBManager.getDBMySQL().Album.GetAlbum(req.params.albumId, (album, error) => {
          if(error){
            res.status(500).json({ error: error });
          }else{

            this.canSeeAlbum(album.id, album.idUser, req.query.userId, (can, err2) => {
              if(err2){
                res.status(500).json(err2);
              }else if(!can){
                res.status(500).json({ error: "Error data security!" });
              }else{

                this.getContentPhoto(album, ( data2, err2 )=>{
                  if(err2){
                    res.status(500).json(err2);
                  }else{
                    res.status(200).json(data2);
                  }
                });

              }

            });

          }
        });
      }
    }


    canSeeAlbum(albumId:number, albumOwner:number, userId:number, callback: (data:boolean, err) => void) :void{

      if(albumOwner == userId){
        callback(true, null);
      }else{

        DBManager.getDBMySQL().User.isSameType(albumOwner, userId, (isSame:boolean, err) => {
            if(err){
              callback(false, err);
            }else if(isSame){
              callback(true, err);
            }else{
              DBManager.getDBMySQL().User.CanSeePhotos(userId, (can:boolean, err) => {
                if(err){
                  callback(false, err);
                }else{
                  callback(can, err);
                }
              });
            }
        });

      }

    }





    /*
      Get Album's photo
      -params Body:
          *Album (id, name, description, userId, creation_date, update_date)
      -response:
          *JSON:
            id, name, description, userId, creation_date, update_date, preview
    */
    private getContentPhoto( album:Album, callback: (data, err) => void ){

      let json = {};

      DBManager.getDBMySQL().Content.AllByAlbumID( album.id, 0, (data, err) => {
        json = {};

        if(err){
          console.log("Error in Get album/getContentPhoto");
        }else{
          json = {
            id: album.id,
            name: album.name,
            description: album.description,
            creation_date: album.creationDate,
            update_date: album.updateDate,
            preview: eval(JSON.stringify(data))
          }
        }

        callback(json, err);

      });
    }

}
