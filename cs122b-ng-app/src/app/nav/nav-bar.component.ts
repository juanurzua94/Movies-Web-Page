import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../movies-list/movies-list.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})

export class NavBarComponent implements OnInit {

  constructor(private service : ConfigService) { }

  ngOnInit() { }

  loggedIn(){
    if(this.service.isLoggedIn() == "Y")
      return "Y"
    return "N";
  }

}
