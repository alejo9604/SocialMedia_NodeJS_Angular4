import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

import { SignService } from "../../services/sign.service"

import { User } from "../../models/user"

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  users:User[] = [];

  success:boolean = false;
  error:boolean = false;

  constructor(private _signServ:SignService,
              private router:Router) {

    this._signServ.canEditUser().subscribe(
      (res)=>{
        this.getUser();
      },
      (error)=>{
        this.router.navigate(['/home']);
      }
    );
  }

  getUser(){
    this._signServ.getUsers().subscribe(
      (res)=>{

        for(let r of res.data){
          let u = new User(r._name, r._username, "", r._email, r._avatar_path);
          u.id = r._id;
          u.type = r._type;
          u.old_type = r._type;
          this.users.push( u );
        }
      },
      (error)=>{
        console.log(error);
      }
    );
  }

  ngOnInit() {
  }

  changeType(index:number){
    this.success = false;
    this.error = false;
    this._signServ.changeType(this.users[index].id, this.users[index].type).subscribe(
      (res)=>{
        this.users[index].type = this.users[index].old_type;
        this.success = true;
        this.error = false;
      },
      (error)=>{
        this.success = false;
        this.error = true;
        console.log(error);
      }
    );
  }

}
