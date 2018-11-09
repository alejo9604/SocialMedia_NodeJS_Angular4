import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, Headers } from '@angular/http';
import {RequestOptions, Request, RequestMethod} from '@angular/http';
import 'rxjs/Rx';

import { SignService } from "./sign.service"

@Injectable()
export class GeneralService {

  private baseURL:string = environment.apiUrl;

  constructor( public http:Http,
               private _signServ:SignService ) { }


  getPhotosHome(from:number = 0){
    let headers = this._signServ.Headers;
    let url = `${this.baseURL}/home`;

    let body = {
      user_id: this._signServ.Username,
      from: from
    };

    return this.http.post( url, body, {
      headers: headers
    }).map( res => {
      return res.json().data;
    });

  }

}
