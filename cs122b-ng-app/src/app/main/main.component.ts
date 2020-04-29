import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from '../movies-list/movies-list.service';
import { Router } from '@angular/router';
import { Form, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy{

  panelOpenState = false;
  genreData : Subscription;
  genres : any;

  letters = [ '*',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  constructor(private service: ConfigService, private router: Router){}

  ngOnInit(){

    if(this.service.isLoggedIn() == "N"){
        this.router.navigate(['api/login']);
    }
    else {
      this.service.getGenres();
      this.genreData = this.service.getGenresinfoUpdateListener()
      .subscribe(genreData => {
        this.genres = genreData;
      })
    }
  }

  getQueryData(form : NgForm){
    this.router.navigate(['api/movies/search'], {queryParams: form.value});
  }

  ngOnDestroy(){
    if(this.service.isLoggedIn() == "Y")
      this.genreData.unsubscribe();
  }

}
