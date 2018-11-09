import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Album } from "../../../models/album";
import { AlbumService } from "../../../services/album.service";
import { SignService } from "../../../services/sign.service";

declare var $:any;

@Component({
  selector: 'app-delete-album',
  templateUrl: './delete-album.component.html',
  styleUrls: ['./delete-album.component.css']
})
export class DeleteAlbumComponent implements OnInit {

  @Input() album:Album;
  error:boolean = false;
  success:boolean = false;

  name:string;

  constructor( private _albumServ:AlbumService,
               private _signSer:SignService,
               private router:Router) { }

  ngOnInit() {
  }

  cerrarModal(){
    this.error = false;
    this.success = false;
    $('#DeleteModal').modal('hide');
  }

  deleteAlbum(){
    if(this.name != this.album.name){
      this.name = "";
      return;
    }

    this._albumServ.deleteAlbum(this.album.id, this.name, +this._signSer.Username).subscribe(
      (res) =>{
        this.success = true;
        this.error = false;
      },
      (error) => {
        console.log(error);
        this.success = false;
        this.error = true;
      }
    );

  }

  toAlbums(){
    this.cerrarModal();
    this.router.navigate(['/albums']);
  }

}
