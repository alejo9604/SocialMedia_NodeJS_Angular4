import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PhotoService } from "../../../services/photo.service";
import { SignService } from "../../../services/sign.service";
import { Photo } from "../../../models/photo";
import { FileItem } from "../../../models/file-item";

@Component({
  selector: 'app-upload-photo',
  templateUrl: './upload-photo.component.html',
  styles: []
})
export class UploadPhotoComponent implements OnInit {

  @Output() refreshPhotosEvent = new EventEmitter<boolean>();

  @Input() previewWidth: number = 50;
  isInDropZone:boolean = false;
  canUpload:boolean = true;
  uploading:boolean = false;
  photoFiles:FileItem[] = [];

  private albumId:number;

  constructor(private _photoSer:PhotoService,
              private _signSer:SignService,
              private activatedRoute:ActivatedRoute) {
      this.activatedRoute.params.subscribe(
        params => {
          if(params['albumId']){
            this.albumId = params['albumId'];
          }
        }
      );
  }

  ngOnInit() {
  }

  uploadsPhotos(){
    this.canUpload = false;
    const formData: any = new FormData();
    const files: Array<FileItem> = this.photoFiles;

    for(let f of files){
      if( f.title == '' || f.title == undefined){
        f.title = f.file.name.split('.')[f.file.name.split('.').length -1];
      }
      formData.append("uploads[]", f.file, f.file['name']);
    }


    this._photoSer.uploadPhoto(formData).subscribe(
      res => {
        let photos:Photo[] = []
        let temp:FileItem;


        for(let r of res){
          temp = this.serachPhoto(r.originalname);
          photos.push( new Photo(0, temp.title, temp.description, r.filename, 0) );
        }

        this._photoSer.insertPhoto(this.albumId, photos, +this._signSer.Username).subscribe( res => {
          console.log(res);

          this.refresh();

        })
      }
    );


  }


  cleanPhotos(){

    this.photoFiles = [];
    this.canUpload = true;
  }

  fileInDropZone( e:boolean ){
    //console.log(e);
    this.isInDropZone = e;
  }

  isImage(file: File): boolean {
    return /^image\//.test(file.type);
  }

  removePhoto(index:number){
    this.photoFiles.splice(index, 1);
  }

  serachPhoto(filename:string):FileItem{
    for(let p of this.photoFiles){
      if(p.file.name == filename){
        return p;
      }
    }
  }

  refresh(){
    this.cleanPhotos();
    this.refreshPhotosEvent.emit(true);
  }

}
