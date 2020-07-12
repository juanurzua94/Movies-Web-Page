import { Component, OnInit, OnDestroy, ElementRef, ComponentFactoryResolver } from '@angular/core';
import { ConfigService } from '../movies-list/movies-list.service';
import { Router } from '@angular/router';
import { Form, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import {FormControl} from '@angular/forms';
import { ViewChild , QueryList} from '@angular/core';
import { MainService } from './main.service';

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

  pastQuery : string;

  suggestedMovies : Subscription;

  movies : any;

  displaySuggested : boolean;

  currentlyHighlighted : string;

  @ViewChild("suggested") suggested : QueryList<ElementRef>;

  constructor(private service: MainService, private configService : ConfigService, private router: Router, private element : ElementRef){
      this.movies = [];
      this.displaySuggested = false;
      this.currentlyHighlighted = "";
  }

  ngOnInit(){

    if(this.configService.isLoggedIn() == "N"){
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

  getSearchResults(form: NgForm){
    console.log(form.value);
    this.router.navigate(['api/movies/fullsearch'], {queryParams: form.value});
  }

  getSuggestedResults(data : any){
    if(data.length < 3){
      this.displaySuggested = false;
      this.currentlyHighlighted = "";
    }
    else if(data.length >= 3 && this.pastQuery != data){
      this.displaySuggested = true;
      console.log("Data is coming from backend");
      this.pastQuery = data;
      this.service.getSuggestedResults({queryParams : data});
      this.suggestedMovies = this.service.getSuggestedMoviesUpdateListener()
      .subscribe(movieTitles => {
        this.movies = movieTitles;
        console.log(this.movies);

      })}

      else {
        this.displaySuggested = true;
        console.log("Data is coming from frontend");
      }

  }

  highLightNextSuggested(){

    if(this.currentlyHighlighted == "" && this.movies.length > 0){
      this.currentlyHighlighted = this.movies[0];
    }
    else {
      for(let i = 0; i < this.movies.length; ++i){
          if(this.movies[i] == this.currentlyHighlighted){
            if((i + 1) != this.movies.length)
              this.currentlyHighlighted = this.movies[++i];
          }
      }
    }
    this.highlightNextDiv();
  }

  highlightPrevSuggested(){
    if(this.currentlyHighlighted == "" && this.movies.length > 0){
      this.currentlyHighlighted = this.movies[0];
    }
    else {
      for(let i = this.movies.length - 1; i >= 0; --i){
          if(this.movies[i] == this.currentlyHighlighted){
            if((i - 1) >= 0)
              this.currentlyHighlighted = this.movies[--i];
          }
      }
    }
    this.highlightPrevDiv();
  }

  private highlightPrevDiv(){
    if(this.currentlyHighlighted != ""){
      let x = this.element.nativeElement.querySelectorAll(".suggested")
      for(let i = x.length - 1; i >= 0; --i){
        if(this.currentlyHighlighted == x.innerText){
          if(i != x.length - 1)
            x[i+1].removeClass('.autocomplete-active')
          x.addClass('.autocomplete-active')
        }
      }
    }
  }

  private highlightNextDiv(){
    if(this.currentlyHighlighted != ""){
      let x = this.element.nativeElement.querySelectorAll(".suggested")
      for(let i = 0; i < x.length; ++i){
        if(this.currentlyHighlighted == x.innerText){
          if(i != 0)
            x[i-1].removeClass('.autocomplete-active')
          x.addClass('.autocomplete-active')
        }
      }
    }
  }

  ngOnDestroy(){
    if(this.configService.isLoggedIn() == "Y")
      this.genreData.unsubscribe();
  }

}
