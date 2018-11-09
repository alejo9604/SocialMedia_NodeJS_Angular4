import { UserDAO } from "./user/user.dao"
import { AlbumDAO } from "./album/album.dao"
import { PhotoDAO } from "./photo/photo.dao"
import { ContentDAO } from "./content/content.dao"
import { GeneralDAO } from "./general/general.dao"


/**
* / dao
*
* @class DBAbstract
*/

export abstract class DBAbstract{

  private _UserDAO:UserDAO;
  private _AlbumDAO:AlbumDAO;
  private _PhotoDAO:PhotoDAO;
  private _ContentDAO:ContentDAO;
  private _GeneralDAO:GeneralDAO;

  constructor( UserDAO:UserDAO, AlbumDAO:AlbumDAO, PhotoDAO:PhotoDAO, ContentDAO:ContentDAO, GeneralDAO:GeneralDAO ){

    this._UserDAO = UserDAO;
    this._AlbumDAO = AlbumDAO;
    this._PhotoDAO = PhotoDAO;
    this._ContentDAO = ContentDAO;
    this._GeneralDAO = GeneralDAO;

  }

  get User():UserDAO{
    return this._UserDAO;
  }

  get Album():AlbumDAO{
    return this._AlbumDAO;
  }

  get Photo():PhotoDAO{
    return this._PhotoDAO;
  }

  get Content():ContentDAO{
    return this._ContentDAO;
  }

  get General():GeneralDAO{
    return this._GeneralDAO;
  }

}
