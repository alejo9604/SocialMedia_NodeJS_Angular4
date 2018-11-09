import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Router } from '@angular/router';

import { Album } from "../../models/album";
import { AlbumService } from "../../services/album.service"
import { SignService } from "../../services/sign.service"

declare var $:any;

@Component({
  selector: 'app-new-album',
  templateUrl: './new-album.component.html',
  styleUrls: ['./new-album.component.css']
})
export class NewAlbumComponent implements OnInit {
  @Output() refreshAlbumsEvent = new EventEmitter<boolean>();


  public album = {
    name: "",
    description: "",
    userId: 0
  };
  private albumId:number;
  error:boolean = false;
  success:boolean = false;

  constructor(private _albumSer:AlbumService,
              private _signSer:SignService,
              private router:Router) { }

  ngOnInit() {
  }

  cerrarModal(){
    this.error = false;
    this.success = false;
    this.album.name = "";
    this.album.description = "";
    $('#myModal').modal('hide');
  }

  saveAlbum(){
    this.album.userId = +this._signSer.Username;
    this._albumSer.insertAlbum(this.album).subscribe(
      (res) =>{
        this.albumId = res._id;
        this.error = false;
        this.success = true;
      },
      (error) => {
        console.log(error);
        this.error = true;
        this.success = false;

      }
    );
  }

  refresh(){
    this.refreshAlbumsEvent.emit(true);
    this.cerrarModal();
  }

  editAlbum(){
    this.cerrarModal();
    this.router.navigate(['/editAlbum', this.albumId]);
  }



}
