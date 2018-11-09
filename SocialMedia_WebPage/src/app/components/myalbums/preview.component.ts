import { Component, OnInit, Input } from '@angular/core';

import { Router } from '@angular/router';

import { Album } from '../../models/album';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  @Input("album") album:Album;

  constructor(private router:Router) { }

  ngOnInit() {
  }

  editAlbum(){
    this.router.navigate(['/editAlbum', this.album.id]);
  }

}
