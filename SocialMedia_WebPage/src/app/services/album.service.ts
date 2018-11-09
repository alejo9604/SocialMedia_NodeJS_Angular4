import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Headers } from '@angular/http';
import {RequestOptions, Request, RequestMethod} from '@angular/http';
import 'rxjs/Rx';

import { Album } from "../models/album";
import { SignService } from "./sign.service"

@Injectable()
export class AlbumService {

  private baseURL:string = environment.apiUrl;

  public albums:Album[] = [];

  constructor( public http:Http,
               private _signServ:SignService ) {
  }

  getAlbum( albumId:number, userId:number = +this._signServ.Username ){

    let headers = this._signServ.Headers;
    let url = `${this.baseURL}/album/${albumId}?userId=${userId}`;

    return this.http.get( url,  {
      headers: headers
    }).map( res => {
      return res.json();
    });
  }


  getAlbums( userId:number = +this._signServ.Username ){

    let headers = this._signServ.Headers;
    let url = `${this.baseURL}/albums/${userId}`;

    return this.http.get( url,  {
      headers: headers
      }).map( res => {
        if(res.status != 200){
          throw new Error(res.json());
        }
        return res.json();
    });
  }

  insertAlbum( album ){

    let headers = this._signServ.Headers;
    let url = `${this.baseURL}/album`;

    return this.http.post(url, album, {
      headers: headers
      } ).map( res => {
      if(res.status != 200){
        throw new Error('insertAlbum failed ' + res.status);
      }
      return res.json();
    });
  }

  updateAlbum( album ){

    let headers = this._signServ.Headers;
    let url = `${this.baseURL}/album`;

    return this.http.put(url, album, {
      headers: headers
      }).map( res => {
      if(res.status != 200){
        throw new Error('updateAlbum failed ' + res.status);
      }
      return res.json();
    });
  }

  deleteAlbum( id:number, name:string, userId:number ){

    let headers = this._signServ.Headers;
    let url = `${this.baseURL}/album`;

    let body = {
      id: id,
      name: name,
      userId: userId
    }


    return this.http.delete(url, new RequestOptions({
        body: body,
        method: RequestMethod.Delete,
        headers: headers
      })
      ).map( res => {
        if(res.status != 200){
          throw new Error('daleteAlbum failed ' + res['error']);
        }
        return res.json();
      });
  }


  exchangePhoto( albumId:number, p1Id:number, p1Order:number, p2Id:number, p2Order:number, userId: number){
    let headers = this._signServ.Headers;
    let url = `${this.baseURL}/exchangePhoto`;

    let body = {
      AlbumId: albumId,
      P1Id: p1Id,
      P1Order: p1Order,
      P2Id: p2Id,
      P2Order: p2Order,
      userId: userId
    };

    return this.http.post(url, body, {
      headers: headers
      } ).map( res => {
      if(res.status != 200){
        throw new Error('exchangePhoto failed ' + res.status);
      }
      return res.json();
    });
  }


  addPhotoToAlbum(albumId:number, photoId:number, userId:number = +this._signServ.Username){
    let headers = this._signServ.Headers;
    let url = `${this.baseURL}/addPhotoToAlbum`;

    let body = {
      albumId: albumId,
      photoId: photoId,
      userId: userId
    };

    return this.http.post(url, body, {
      headers: headers
      } ).map( res => {
      if(res.status != 200){
        throw new Error('Add failed ' + res.status);
      }
      return res.json();
    });
  }

}
