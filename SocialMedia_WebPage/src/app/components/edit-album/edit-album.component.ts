import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { AlbumService } from "../../services/album.service";
import { PhotoService } from "../../services/photo.service";
import { SignService } from "../../services/sign.service";
import { Album } from "../../models/album";
import { Photo } from "../../models/photo";

declare var $:any;

@Component({
  selector: 'app-edit-album',
  templateUrl: './edit-album.component.html',
  styleUrls: ['./edit-album.component.css']
})
export class EditAlbumComponent implements OnInit {

  private albumId:number;

  album:Album;
  showUploadPhoto:boolean = false;
  inEdit:boolean = false;
  inEditPhoto:boolean = false;

  albumEdit = {
    name: "",
    description: ""
  }

  showError:boolean = false;
  showSucces:boolean = false;

  photoIndex:number = 0;

  photoEdit = {
    title: "",
    description: ""
  }


  exchangeIndexA:number = -1;



  constructor( private _albumSer:AlbumService,
               private _photoSer:PhotoService,
               private _signSer:SignService,
               private router:Router,
               private activatedRoute:ActivatedRoute) {
     this.activatedRoute.params.subscribe(
       params => {
         this.albumId = params['albumId'];
         this.getAlbum();
       }
     );
  }

  getAlbum(){
    this._albumSer.getAlbum( this.albumId ).subscribe(
      (res) => {
        this.album = new Album(res.id, res.name, res.description, res.creation_date, res.update_date);
        this.album.setPreviewPhotosFormJson(res.preview);
        if(this.album.previewPhotos.length == 0){
          this.showUploadPhoto = true;
        }

        this.albumEdit.name = this.album.name;
        this.albumEdit.description = this.album.description;
      },
      (error) => {
        this.router.navigate(['/albums']);
      }
    );
  }

  refreshPhotos(e:boolean){
    if(e){
      this.showUploadPhoto = false;
      this.getAlbum();
    }
  }


  updateAlbum(){

    let album = {
      id: this.albumId,
      name: this.albumEdit.name,
      description: this.albumEdit.description,
      userId: +this._signSer.Username
    }

    this._albumSer.updateAlbum(album).subscribe(
      (res) =>{
        this.inEdit = false;
        this.album.name = res._name;
        this.album.description = res._description;
        this.showError = false;
        this.showSucces = true;
      },
      (error) => {
        console.log(error);
        this.inEdit = false;
        this.showError = true;
        this.showSucces = false;
      }
    );
  }


  canSave():boolean{
    return (this.album.name == this.albumEdit.name && this.album.description == this.albumEdit.description);
  }

  ngOnInit() {
  }

  editPhoto(index:number){
    if(index != this.photoIndex){
      this.inEditPhoto = true;
    }else{
      this.inEditPhoto = !this.inEditPhoto;
    }
    this.photoIndex = index;
    this.photoEdit.title = this.album.previewPhotos[index].title;
    this.photoEdit.description = this.album.previewPhotos[index].description;

  }

  cancelEditPhoto(){
    this.album.previewPhotos[this.photoIndex].title = this.photoEdit.title;
    this.album.previewPhotos[this.photoIndex].description = this.photoEdit.description;
    this.editPhoto(this.photoIndex);
  }

  updatePhoto(){
    let photo = {
      id: this.album.previewPhotos[this.photoIndex].id,
      title: this.album.previewPhotos[this.photoIndex].title,
      description: this.album.previewPhotos[this.photoIndex].description,
      userId: +this._signSer.Username
    }

    this._photoSer.updatePhoto(photo).subscribe(
      (res) =>{
        this.album.previewPhotos[this.photoIndex].title = res._title;
        this.album.previewPhotos[this.photoIndex].description = res._description;
        this.album.previewPhotos[this.photoIndex].update_date = res._update_date;
        this.editPhoto(this.photoIndex);
      },
      (error) => {
        console.log(error);
        this.editPhoto(this.photoIndex);
      }
    );
  }



  openPhoto(index:number){
    this.photoIndex = index;
    $('#PhotoModal').modal();
  }

  openDelete(){

    $('#DeleteModal').modal();
  }


  deletePhoto( photo:Photo, i:number ){
    this._photoSer.deletePhoto(photo.id, photo.path, +this._signSer.Username).subscribe(
      (res) =>{

        this.album.previewPhotos.splice(i, 1);
        console.log(res);
      },
      (error) => {
        console.log(error);
      }
    );
  }


  exchangePhoto( index ){

    if(this.exchangeIndexA == -1){
      this.exchangeIndexA = index;
    }else{

      let a = this.album.previewPhotos[this.exchangeIndexA];
      this.album.previewPhotos[this.exchangeIndexA] = this.album.previewPhotos[index];
      this.album.previewPhotos[index] = a;

      this.album.previewPhotos[this.exchangeIndexA].exchangePhoto(this.album.previewPhotos[index]);


      this._albumSer.exchangePhoto(
          this.albumId,
          this.album.previewPhotos[this.exchangeIndexA].id,
          this.album.previewPhotos[this.exchangeIndexA].order,
          this.album.previewPhotos[index].id,
          this.album.previewPhotos[index].order,
          +this._signSer.Username
       ).subscribe((res) =>{
         console.log(res);
       },
       (error) => {
         console.log(error);
       });

      this.exchangeIndexA = -1;
    }


  }

}
