import { Component, OnInit } from '@angular/core';

import { SignService } from '../../services/sign.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {

  profile: any;

  constructor(private _singServ:SignService) { }

  ngOnInit() {
  }

}
