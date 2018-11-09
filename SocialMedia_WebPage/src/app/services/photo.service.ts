import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Headers } from '@angular/http';
import {RequestOptions, Request, RequestMethod} from '@angular/http';
import 'rxjs/Rx';

import { Photo } from "../models/photo";

@Injectable()
export class PhotoService {

  private baseURL:string = environment.apiUrl;

  constructor( public http:Http ) { }

  uploadPhoto(formData:FormData){

    let headers = new Headers();
    // SignService.createAuthorizationHeader(headers);
    headers.append('Authorization', "bearer " + localStorage.getItem('bearer'));

    return this.http.post(`${this.baseURL}/updloadPhoto`, formData,  {
      headers: headers
    })
      .map(files => {
        return files.json();
      });
  }

  insertPhoto(albumId:number, photos:Photo[], userId:number ){

    let headers = new Headers();
    // SignService.createAuthorizationHeader(headers);
    headers.append('Authorization', "bearer " + localStorage.getItem('bearer'));

    let url = `${this.baseURL}/photo`;

    for(let p of photos){
      p.path = this.baseURL + "/" + p.path;
    }
    let body = {
      albumId: albumId,
      photos: eval(JSON.stringify(photos)),
      userId: userId
    };

    return this.http.post(url, body, {
      headers: headers
    }).map( res => {
      return res.json();
    });
  }


  updatePhoto( photo ){

    let headers = new Headers();
    // SignService.createAuthorizationHeader(headers);
    headers.append('Authorization', "bearer " + localStorage.getItem('bearer'));

    let url = `${this.baseURL}/photo`;

    return this.http.put(url, photo,  {
      headers: headers
    }).map( res => {
      if(res.status != 200){
        throw new Error('updatePhoto failed ' + res);
      }
      return res.json();
    });
  }


  deletePhoto( id:number, path:string, userId:number ){

    let headers = new Headers();
    // SignService.createAuthorizationHeader(headers);
    headers.append('Authorization', "bearer " + localStorage.getItem('bearer'));

    let url = `${this.baseURL}/photo`;

    let body = {
      id: id,
      path: path,
      userId: userId
    }


    return this.http.delete(url, new RequestOptions({
        body: body,
        method: RequestMethod.Delete,
        headers: headers
      })
      ).map( res => {
        if(res.status != 200){
          throw new Error('daleteDelete failed ' + res['error']);
        }
        return res.json();
      });
  }

}
