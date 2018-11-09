import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { User } from "../../models/user";
import { FileItem } from "../../models/file-item";
import { SignService } from "../../services/sign.service";


declare var $:any;

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  private user:User = new User("", "", "", "");

  fileAvatar:FileItem[] = [];
  form:FormGroup;

  success:boolean = false;
  error:boolean = false;
  msg:string = "";


  password:string = "";
  new_password:string = "";
  new_password2:string = "";
  errorPassData:boolean = false;
  successPass:boolean = false;
  errorPass:boolean = false;


  constructor(private _signServ:SignService) {

    this._signServ.getProfile(+this._signServ.Username).subscribe(
      (res) => {
        this.user = new User(res.name, res.username, "", res.email);

        if(res.avatar_path != ""){
          this.user.avatar = res.avatar_path;
        }

        console.log(res);
      },
      (error) => {
        console.log(error);
      }
    );



    this.form = new FormGroup({

      'name': new FormControl('',   [
                                      Validators.required
                                    ]),
      'username': new FormControl('',   [
                                      Validators.required,
                                      Validators.minLength(4)
                                    ]),
      'email': new FormControl('',   [
                                      Validators.required,
                                      Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")
                                    ]),
      'password': new FormControl('', [Validators.required,
                                        Validators.pattern("(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{8,}")
      ]),
      'password2': new FormControl()
    });

    this.form.controls['password2'].setValidators([
      Validators.required,
      this.noSame.bind( this.form )
    ]);
  }

  ngOnInit() {
  }

  noSame( control:FormControl ): { [s:string]:boolean } {

    let form:any = this;

    if(control.value !== form.controls['password'].value){
      return {
        "nosame":true
      }
    }

    return null;
  }


  openChangePassModal(){
    $('#ChangePassModal').modal();
    this.errorPassData = false;
  }

  closeChangePassModal(){
    $('#ChangePassModal').modal('hide');
    this.errorPassData = false;
  }

  changePassword(){
    let RE = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$");

    if(this.password == "" || !RE.test(this.new_password) || this.new_password != this.new_password2){
      this.errorPassData = true;
    }else{
      this.errorPassData = false;
      this._signServ.changePassword(this.password, this.new_password).subscribe(
        (res)=>{
          this.successPass = true;
          this.errorPass = false;
        },
        (error)=>{
          //console.log(error);
          this.successPass = false;
          this.errorPass = true;
        }
      );
      this.password = "";
      this.new_password = "";
      this.new_password2 = "";
    }

  }

}
//$2a$10$F.gD11fQyQ.Kvd0.Bsw0u.xp2akbvjOgzwMgPiuQMe9V58QVEQPLK
