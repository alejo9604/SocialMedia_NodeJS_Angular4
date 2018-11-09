import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

import { GeneralService } from '../../services/general.service';

declare var $:any;

@Component({
  selector: 'login-home',
  templateUrl: './login-home.component.html',
  styleUrls: ['./login-home.component.css']
})
export class LoginHomeComponent implements OnInit {

  photos:any[] = [];
  from:number = 0;

  index:number = 0;

  constructor( private _generalServ:GeneralService,
               private router:Router) {
    this.getPhotos();
  }

  ngOnInit() {
  }


  getPhotos(){
    this._generalServ.getPhotosHome(this.from).subscribe(
      (res) =>{
        res.forEach(elem => {
            this.photos.push(elem);
        });
        this.from = this.photos.length;
      },
      (error) =>{
          console.log(error);
      }
    );
  }

  openPhoto(index:number){
    this.index = index;
    $('#PhotoModal').modal();
  }

  openAlbum(){
    $('#PhotoModal').modal('hide');
    this.router.navigate(['/user', this.photos[this.index].user_id, this.photos[this.index].album_id]);
  }

}
