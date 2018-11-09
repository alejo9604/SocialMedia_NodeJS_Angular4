import { Component, OnInit } from '@angular/core';

import { Album } from '../../models/album';
import { Photo } from '../../models/photo';

import { AlbumService } from '../../services/album.service';
import { SignService } from '../../services/sign.service';
import { Router } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-myalbums',
  templateUrl: './myalbums.component.html',
  styleUrls: ['./myalbums.component.css']
})
export class MyAlbumsComponent implements OnInit {

  albums:Album[] = [];
  isEnHttp:boolean = false;

  constructor( public _albumSer:AlbumService,
               private _signServ:SignService,
               private router:Router) {


    // let pathTest = "https://www.grupbalana.com/content/imgsxml/teatro/big-2test-400x570149.jpg";
    // let pathTest2 = "https://i.vimeocdn.com/portrait/58832_300x300";

    this.getAlbums();
  }

  getAlbums(){
    this._albumSer.getAlbums(+this._signServ.Username).subscribe(
      (res) =>{
        this.isEnHttp = true;
        for(let a of res){

          let album:Album = new Album(a.id, a.name, a.description, a.creation_date, a.update_date);
          album.setPreviewPhotosFormJson(a.preview);

          this.albums.push( album );
          //this.albums[this.albums.length - 1].previewPhotos = p;
        }

        this.albums.sort(function (a, b) {
           return (a.creation_date < b.creation_date) ? 1 : -1;
        });


      },
      (error) => {
        this._signServ.logout();
        this.router.navigate(['/home']);
      }
    );
  }

  refreshAlbums(e:boolean){
    if(e){
      this.isEnHttp = false;
      this.getAlbums();
    }
  }

  ngOnInit() {
  }

  abrirModal(){
    $('#myModal').modal();
  }

}
