import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {ConfigService} from './movies-list.service';
import { Subscription } from 'rxjs';
import {movie} from './movies-list.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {Actor} from './actor.model';
import { Router, ActivatedRoute } from '@angular/router';
import { IfStmt, ThrowStmt } from '@angular/compiler';

@Component({
  selector : 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.css']
})
export class MoviesListComponent implements OnInit, OnDestroy{

  data = null;
  private movieList : Subscription;
  movies : movie[] = [];
  moviesForDisplay : movie[] = [];
  itemsToDisplay : number;
  actors : Actor[] = [];
  displayedColumns = ['title', 'year', 'director', 'rating', 'actors', 'genres'];
  added = false;

  pageOffset : number;
  databaseOffset : number;

  genreName : string;
  letter : string;

  inGenre : boolean;
  inLetter : boolean;
  inSearch : boolean;

  numberOfCurrentItems : number;

  sorted_by_rating_asc : boolean;
  sorted_by_rating_desc : boolean;

  sorted_by_title_asc : boolean;
  sorted_by_title_desc: boolean;


  show_next_page : boolean;

  searchData : any;

  dataSource = new MatTableDataSource<movie>(this.movies);
  @ViewChild(MatPaginator, {static : true}) paginator;
  constructor(public service: ConfigService, private router: Router, private _activatedRoute : ActivatedRoute){
    this.inGenre = false;
    this.inLetter = false;
    this.inSearch = false;
    this.pageOffset = 0;
    this.databaseOffset = 0;
    this.itemsToDisplay = 10;
    this.numberOfCurrentItems = 0;
    this._activatedRoute.params.subscribe(params => {
        //this.determineServiceInstruction(this._activatedRoute.snapshot.paramMap);
    });
    this.sorted_by_title_desc = true;
    this.sorted_by_rating_desc = true;
    this.show_next_page = false;

  }

  ngOnInit(){
      if(this.service.isLoggedIn() == "N"){

          this.router.navigate(['api/login']);

      }
      else {
        //this.service.getMovie(this._activatedRoute.snapshot.paramMap.get("movieName"));

        if(this._activatedRoute.snapshot.paramMap.get("genreName") != null){
          this.inGenre = true;
          this.genreName = this._activatedRoute.snapshot.paramMap.get("genreName")
          this.service.getMoviesinGenre(this.genreName, this.databaseOffset);
          this.movieList = this.service.getMovieUpdateListener()
            .subscribe((movies : movie[]) => {
              this.movies = movies;
              this.moviesForDisplay = [];
              this.insertMoviesForDisplay();
              //this.dataSource = new MatTableDataSource<movie>(this.movies);
              //this.dataSource.paginator = this.paginator;

            });

        }

        else if(this._activatedRoute.snapshot.paramMap.get("letter") != null){
          this.inLetter = true;
          this.letter = this._activatedRoute.snapshot.paramMap.get("letter")
          this.service.getMoviesByLetter(this.letter, this.databaseOffset);
          this.movieList = this.service.getMovieUpdateListener()
          .subscribe((movies : movie[]) =>{
            this.movies = movies;
            this.moviesForDisplay = [];
            this.insertMoviesForDisplay();

           //this.dataSource = new MatTableDataSource<movie>(this.movies);
          // this.dataSource.paginator = this.paginator;

          });
        }

        else if(this._activatedRoute.snapshot.queryParams.title != undefined) {
            this.inSearch = true;
            this.searchData = this.copyQueryObject(this._activatedRoute.snapshot.queryParams);
            this.searchData['offset'] = this.databaseOffset;
            console.log(this.searchData);
            this.service.getQueryResults(this.searchData);
            this.movieList = this.service.getMovieUpdateListener()
            .subscribe((movies : movie[]) =>{
              this.movies = movies;
              this.moviesForDisplay = [];
              this.insertMoviesForDisplay();

             //this.dataSource = new MatTableDataSource<movie>(this.movies);
             //this.dataSource.paginator = this.paginator;
            })
        }
        else {

          this.service.getMovies();
          this.movieList = this.service.getMovieUpdateListener()
          .subscribe((movies: movie[]) =>{
            this.movies = movies;
            this.moviesForDisplay = [];
            this.insertMoviesForDisplay();

           //this.dataSource = new MatTableDataSource<movie>(this.movies);
           //this.dataSource.paginator= this.paginator;
          })
        }
    }
  }

  copyQueryObject(data : any){
    let temp = {};
    for(let [key, value] of Object.entries(data)){
      temp[key] = value;
    }
    return temp;
  }

  myEval(items){
    return eval(items);
  }

  /*
  determineServiceInstruction(data : any){
    if(data.get('genreName') != null){
      this.service.getMoviesinGenre(data.get("genreName"));
      this.movieList = this.service.getMovieUpdateListener()
              .subscribe((movies : movie[]) => {
                this.movies = movies;
                this.moviesForDisplay = [];
                this.insertMoviesForDisplay();

               // this.dataSource = new MatTableDataSource<movie>(this.movies);
               // this.dataSource.paginator = this.paginator;
              });
      }
    }*/

    addToShoppingCart(dataTitle : string, dataId : string){
      this.service.addToShoppingCart(dataTitle, dataId);
      this.added = true;
    }

    setItemsPer(data: number){ // refactor

      if(this.pageOffset + data <= 50){
        this.numberOfCurrentItems = 0;
        this.itemsToDisplay = data;
        this.moviesForDisplay = [];
        this.insertMoviesForDisplay();
      } else {
          this.databaseOffset += this.pageOffset;
          this.pageOffset = 0;
          this.numberOfCurrentItems = 0;
          this.itemsToDisplay = data;

          if(this.inGenre){
            this.getNextSetOfMoviesFromGenre();
          }
          else if(this.inLetter){
            this.getNextSetOfMoviesFromLetter();
          }
          else{
            this.searchData['offset'] = this.databaseOffset;
            this.getNextSetOfMoviesFromSearch();
          }

      }
    }

    insertMoviesForDisplay(){
      console.log("OFFSET : " + this.pageOffset);
      console.log("ITEMS TO DISPLAY : " + this.itemsToDisplay)
      for(let i = this.numberOfCurrentItems + this.pageOffset; i < (this.itemsToDisplay + this.pageOffset) && i < this.movies.length; ++i){
          console.log("Excuted ? " + i);
          this.moviesForDisplay.push(this.movies[i]);
          ++this.numberOfCurrentItems;
        }
      console.log(this.moviesForDisplay);
      /*
      for(let i = this.itemsDisplayingFromMovies; i < this.itemsToDisplay && i < this.movies.length; ++i){
        this.moviesForDisplay.push(this.movies[i]);
      }

      if(this.itemsDisplayingFromMovies == 0)
        this.itemsDisplayingFromMovies = 10;*/
    }

    sortByTitle(){

      if(this.sorted_by_title_desc){
        this.moviesForDisplay.sort((a, b) => (a.title > b.title) ? 1 : -1);
        this.sorted_by_title_desc = false;
        this.sorted_by_title_asc = true;
      }
      else {
        this.moviesForDisplay.sort((a, b) => (a.title < b.title) ? 1 : -1);
        this.sorted_by_title_asc = false;
        this.sorted_by_title_desc = true;
      }


      //this.dataSource = new MatTableDataSource<movie>(this.movies);
      //this.dataSource.paginator = this.paginator;

    }

    sortByRating(){
      if(this.sorted_by_rating_desc){
        this.moviesForDisplay.sort((a, b) => (a.rating > b.rating) ? 1 : -1);
        this.sorted_by_rating_desc = false;
        this.sorted_by_rating_asc = true;
      }
      else {
        this.moviesForDisplay.sort((a, b)=> (a.rating < b.rating) ? 1 : -1);
        this.sorted_by_rating_asc = false;
        this.sorted_by_rating_desc = true;
      }
      //this.dataSource = new MatTableDataSource<movie>(this.movies);
      //this.dataSource.paginator = this.paginator;

    }

    displayPrevItems(){
      if(this.pageOffset >= (this.itemsToDisplay)){
        this.pageOffset -= (this.itemsToDisplay)
        this.numberOfCurrentItems = 0;
        this.moviesForDisplay = [];
        this.insertMoviesForDisplay();
      }
      else {
        if(this.databaseOffset >= 50){
          this.pageOffset = 50 - this.itemsToDisplay;
          this.numberOfCurrentItems = 0;
          this.databaseOffset -= 50;
          if(this.inGenre){
            this.getNextSetOfMoviesFromGenre();
          }
          else if(this.inLetter){
            this.getNextSetOfMoviesFromLetter();
          }
          else{
            this.searchData['offset'] = this.databaseOffset;
            this.getNextSetOfMoviesFromSearch();
          }
        }
        else if(this.databaseOffset > 0){
          this.pageOffset = 50 - this.itemsToDisplay;
          this.numberOfCurrentItems = 0;
          this.databaseOffset -= this.databaseOffset;

          if(this.inGenre){
            this.getNextSetOfMoviesFromGenre();
          }
          else if(this.inLetter){
            this.getNextSetOfMoviesFromLetter();
          }
          else{
            this.searchData['offset'] = this.databaseOffset;
            this.getNextSetOfMoviesFromSearch();
          }
        }
      }
        /*
      if(this.offset >= 100){
        this.offset -= 100;
      }*/

    }

    displayNextItems(){

      if(this.pageOffset + (this.itemsToDisplay) < 50){
        this.pageOffset += (this.itemsToDisplay);
        this.numberOfCurrentItems = 0;
        this.moviesForDisplay = [];
        this.insertMoviesForDisplay();
      }
      else {
          this.pageOffset = 0;
          this.numberOfCurrentItems = 0;
          this.databaseOffset += 50;
          if(this.inGenre){
            this.getNextSetOfMoviesFromGenre();
          }
          else if(this.inLetter){
            this.getNextSetOfMoviesFromLetter();
          }
          else{
            this.searchData['offset'] = this.databaseOffset;
            this.getNextSetOfMoviesFromSearch();
          }
      }

      /*
      if(this.numberOfCurrentItems == 100){
        this.offset += 100;
        if(this.inGenre){
          this.service.getMoviesinGenre(this.genreName);

          this.movieList = this.service.getMovieUpdateListener()
          .subscribe((movies : movie[]) => {
            this.movies = movies;
            this.moviesForDisplay = [];
            this.insertMoviesForDisplay();
            //this.dataSource = new MatTableDataSource<movie>(this.movies);
            //this.dataSource.paginator = this.paginator;

          });
        }
      }
      else {
        this.moviesForDisplay = [];
        this.insertMoviesForDisplay();
        this.numberOfCurrentItems += this.itemsToDisplay;
      }*/
    }

    getNextSetOfMoviesFromGenre(){

      this.service.getMoviesinGenre(this.genreName, this.databaseOffset);

    }

    getNextSetOfMoviesFromLetter(){
      this.service.getMoviesByLetter(this.letter, this.databaseOffset);
    }

    getNextSetOfMoviesFromSearch(){
      this.service.getQueryResults(this.searchData);
    }



  ngOnDestroy(){
    if(this.service.isLoggedIn() == "Y")
      this.movieList.unsubscribe();
  }
}
