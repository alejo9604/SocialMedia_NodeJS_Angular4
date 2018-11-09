import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SignService } from '../../services/sign.service'

declare var $:any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user = {
    username: "",
    password: ""
  }

  error:boolean = false;

  constructor( private _singServ:SignService,
               private router:Router) {
  }

  ngOnInit() {
  }


  login(){
    this._singServ.authenticate(this.user.username, this.user.password).subscribe(
      (res) =>{
        this.reset();
        this.router.navigate(['/albums']);
      },
      (error) => {
        this.error = true;
      });
  }

  logout(){
    this.reset();
    this._singServ.logout();
    this.router.navigate(['/home']);
  }

  openSignUp(){
    this.reset();
    $('#SignUpModal').modal();
  }

  reset(){
    this.user.username = "";
    this.user.password = "";
    this.error = false;
  }

}
