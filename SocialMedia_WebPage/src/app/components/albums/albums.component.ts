import { Component, OnInit } from '@angular/core';

import { Album } from "../../models/album";
import { Photo } from "../../models/photo";

import { AlbumService } from '../../services/album.service';
import { Router, ActivatedRoute } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent implements OnInit {

  private userId:number;
  private albumId:number;

  album:Album;
  photoIndex:number = -1;
  myAlbums:Album[];

  success:boolean = false;
  error:boolean = false;
  successMsg:string = "";


  constructor(private router:Router,
              private activatedRoute:ActivatedRoute,
              private _albumSer:AlbumService) {
      this.activatedRoute.params.subscribe(
        params => {
          this.userId = params['userId'];
          this.albumId = params['albumId'];

          this.getAlbum();

        }
      );
  }

  ngOnInit() {
  }

  getAlbum(){
    this._albumSer.getAlbum( this.albumId ).subscribe(
      (res) => {
        this.album = new Album(res.id, res.name, res.description, res.creation_date, res.update_date);
        this.album.setPreviewPhotosFormJson(res.preview);

        /*
        if(this.album.previewPhotos.length == 0){
          this.showUploadPhoto = true;
        }*/
      },
      (error) => {
        this.router.navigate(['/home']);
      }
    );
  }


  openModal(index:number){
    this.photoIndex = index;
    this._albumSer.getAlbums().subscribe(
      (res)=>{
        this.myAlbums = [];
        for(let a of res){
          this.myAlbums.push( new Album(a.id, a.name, a.description, a.creation_date, a.update_date) );
        }

      },
      (error) => {
        console.log(error);
      }
    );


    $('#AddPhotoModal').modal();
  }


  addoPhotoToAlbum(albumIndex:number){

    if(this.photoIndex < 0)
      return;

    this._albumSer.addPhotoToAlbum(this.myAlbums[albumIndex].id, this.album.previewPhotos[this.photoIndex].id).subscribe(
      (res)=>{

        this.success = true;
        this.error = false;
        this.successMsg = `Photo ${this.album.previewPhotos[this.photoIndex].title} added to ${this.myAlbums[albumIndex].name} album.`;

        //$('#AddPhotoModal').modal('hide');
      },
      (error)=>{
        if(error.status == 505){
          this.success = true;
          this.error = false;
          this.successMsg = `Photo ${this.album.previewPhotos[this.photoIndex].title} alredy exists in ${this.myAlbums[albumIndex].name} album.`;
        }else{
          this.error = true;
          this.success = false;
          console.log(error);
        }
      }
    );
  }


  closeAddPhotoModal(){
    $('#AddPhotoModal').modal('hide');
    this.photoIndex = -1;
  }


}
