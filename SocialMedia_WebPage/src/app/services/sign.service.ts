import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { Http, Headers } from '@angular/http';
import 'rxjs/Rx';

import { User } from "../models/user";

@Injectable()
export class SignService {

  private baseURL:string = environment.apiUrl;

  static username:string;

  isAdmin:boolean = false;

  constructor( public http:Http ) {
  }


  uploadPhoto(file){


    return this.http.post(`${this.baseURL}/updloadAvatar`, file)
      .map(res => {
        return res.json();
      });
  }


  singUp( user ){

    let url = `${this.baseURL}/singUp`;

    if(user.avatar != ""){
      user.avatar = this.baseURL + "/Avatars/" + user.avatar;
    }

    return this.http.post(url, user ).map( res => {
      if(res.status != 200){
        throw new Error(res.json());
      }
      return res.json();
    });
  }

  authenticate(username:string, pass:string){
    let url = `${this.baseURL}/authenticate`;

    let user = {
      username: username,
      password: pass
    }

    return this.http.post(url, user ).map( res => {
      //console.log(res.status);
      if(res.status != 200){
        throw new Error(res.json());
      }

      this.setSession(res.json());
      return res.json();
    });
  }

  private setSession(authResult): void {
    let parted = authResult.token.split(' ');
    if (parted.length === 2) {
      localStorage.setItem('bearer', parted[1]);
      localStorage.setItem('username', authResult.id);

      this.isAdmin = authResult.ce;

    } else {
      return;
    }
    // Set the time that the access token will expire at
    //const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    //localStorage.setItem('id_token', authResult.idToken);
    //localStorage.setItem('expires_at', expiresAt);
  }

  getProfile(userId:number){

    let url = `${this.baseURL}/profile/${userId}`;

    return this.http.get(url, {headers: this.Headers} ).map( res => {
      if(res.status != 200){
        throw new Error(res.json());
      }
      let data = res.json();
      return data.profile;
    });
  }


  getUsers(){

    let url = `${this.baseURL}/getUsers`;

    let body = {
      userId: +this.Username,
    }

    return this.http.post(url, body, {headers: this.Headers} ).map( res => {
      if(res.status != 200){
        throw new Error(res.json());
      }
      return res.json();
    });
  }


  changePassword(password:string, new_password:string){
    let headers = this.Headers;
    let url = `${this.baseURL}/changePassword`;

    let body = {
      userId: +this.Username,
      password: password,
      new_password: new_password
    };

    return this.http.post( url, body, {
      headers: headers
    }).map( res => {
      if(res.status != 200){
        throw new Error(res.json());
      }
      return res.json();
    });
  }


  canEditUser(){
    let headers = this.Headers;
    let url = `${this.baseURL}/ceu`;

    let body = {
      userId: +this.Username,
    };

    return this.http.post( url, body, {
      headers: headers
    }).map( res => {
      return res.json();
    });
  }


  changeType(targetId:number, type:number){
    let headers = this.Headers;
    let url = `${this.baseURL}/changeType`;

    let body = {
      userId: +this.Username,
      targerId: targetId,
      new_type: type
    };

    return this.http.post( url, body, {
      headers: headers
    }).map( res => {
      return res.json();
    });
  }



  static getSession():string{
    if(localStorage.exist('bearer')){
      return "bearer " + localStorage.getItem('bearer');
    }else{
      return "";
    }
  }

  static createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', SignService.getSession());
  }

  public isAuthenticated(): boolean {
    if(localStorage.getItem('bearer') && localStorage.getItem('username')){
      return true;
    }else{
      return false;
    }
  }


  logout(){
    localStorage.removeItem('bearer');
    localStorage.removeItem('username');
    this.isAdmin = false;
  }


  get Headers():Headers{
    let headers = new Headers();
    headers.append('Authorization', "bearer " + localStorage.getItem('bearer'));

    return headers;
  }

  get Username(){
    return localStorage.getItem("username");
  }

}
