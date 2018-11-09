import { Component, OnInit, Input } from '@angular/core';

import { Album } from "../../models/album";

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent implements OnInit {

  @Input() album:Album;
  @Input() photoIndex:number;

  constructor() { }

  ngOnInit() {
  }

}
