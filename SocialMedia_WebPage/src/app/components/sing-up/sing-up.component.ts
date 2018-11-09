import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { Observable } from 'rxjs/Rx';

import { User } from "../../models/user"
import { FileItem } from "../../models/file-item";
import { SignService } from "../../services/sign.service"

declare var $:any;

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.component.html',
  styleUrls: ['./sing-up.component.css']
})
export class SingUpComponent implements OnInit {

  private user:User;

  fileAvatar:FileItem[] = [];
  form:FormGroup;

  success:boolean = false;
  error:boolean = false;
  msg:string = "";

  constructor( private _signServ:SignService) {

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


  save(){
    if(!this.form.valid){
      return;
    }
    this.user = new User(this.form.value.name, this.form.value.username, this.form.value.password, this.form.value.email);

    if(this.fileAvatar.length > 0){

      const formData: any = new FormData();
      formData.append("avatar", this.fileAvatar[0].file, this.fileAvatar[0].file['name']);

      this._signServ.uploadPhoto(formData).subscribe(
        (res) => {
          this.user.avatar = res.filename;
          this.SaveUser();
        },
        (error)=>{
          console.log(error);
          this.user.avatar = "";
          this.SaveUser();
        }
      );
    }
  }


  SaveUser(){
    this._signServ.singUp(this.user).subscribe(
      (res) =>{
        this.success = true;
        this.error = false;
      },
      (error) => {
        this.error = true;
        this.success = false;
        if(error.status == 501){
          this.msg = "Username already exists";
        }else{
          this.msg = "Sorry, something went wrong. Please try later.";
        }
      }
    );
  }


  closeModal(){
    this.success = false;
    this.error = false;
    this.user = undefined;
    if(this.fileAvatar.length > 0){
      this.fileAvatar.splice(0,this.fileAvatar.length);
    }
    this.form.reset({
      name: "",
      username: "",
      password: "",
      password2: "",
      email: ""
    });
    $('#SignUpModal').modal('hide');
  }
}
