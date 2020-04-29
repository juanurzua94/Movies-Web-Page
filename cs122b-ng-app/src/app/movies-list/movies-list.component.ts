import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {ConfigService} from './movies-list.service';
import { Subscription } from 'rxjs';
import {movie} from './movies-list.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {Actor} from './actor.model';
import { Router, ActivatedRoute } from '@angular/router';

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

  offset : number;
  genreName : string;
  letter : string;

  inGenre : boolean;
  inLetter : boolean;
  inSearch : boolean;

  itemsDisplayingFromMovies : number;

  dataSource = new MatTableDataSource<movie>(this.movies);
  @ViewChild(MatPaginator, {static : true}) paginator;
  constructor(public service: ConfigService, private router: Router, private _activatedRoute : ActivatedRoute){
    this.inGenre = false;
    this.inLetter = false;
    this.inSearch = false;
    this.offset = 0;
    this.itemsToDisplay = 10;
    this.itemsDisplayingFromMovies = 0;
    this._activatedRoute.params.subscribe(params => {
        this.determineServiceInstruction(this._activatedRoute.snapshot.paramMap);
    });
  }


  /*
  getActorData($event){
    alert($event['toElement']['innerText']);
  }

  getGenreMovies($event){
    alert($event['toElement']['innerText']);
  }*/

  ngOnInit(){
      if(this.service.isLoggedIn() == "N"){

          this.router.navigate(['api/login']);

      }
      else {
        //this.service.getMovie(this._activatedRoute.snapshot.paramMap.get("movieName"));

        if(this._activatedRoute.snapshot.paramMap.get("genreName") != null){
          this.inGenre = true;
          this.genreName = this._activatedRoute.snapshot.paramMap.get("genreName")
          this.service.getMoviesinGenre(this.genreName);

            this.movieList = this.service.getMovieUpdateListener()
            .subscribe((movies : movie[]) => {
              this.movies = movies;
              this.insertMoviesForDisplay();
              this.dataSource = new MatTableDataSource<movie>(this.movies);
              this.dataSource.paginator = this.paginator;

            });

        }

        else if(this._activatedRoute.snapshot.paramMap.get("letter") != null){
          this.inLetter = true;
          this.letter = this._activatedRoute.snapshot.paramMap.get("letter")
          this.service.getMoviesByLetter(this.letter);
          this.movieList = this.service.getMovieUpdateListener()
          .subscribe((movies : movie[]) =>{
            this.movies = movies;
            this.insertMoviesForDisplay();

           this.dataSource = new MatTableDataSource<movie>(this.movies);
           this.dataSource.paginator = this.paginator;

          });
        }

        else if(this._activatedRoute.snapshot.queryParams.title != undefined) {
            this.inSearch = true;
            console.log(this._activatedRoute.snapshot.queryParams);
            this.service.getQueryResults(this._activatedRoute.snapshot.queryParams);
            this.movieList = this.service.getMovieUpdateListener()
            .subscribe((movies : movie[]) =>{
              this.movies = movies;
              this.insertMoviesForDisplay();

             this.dataSource = new MatTableDataSource<movie>(this.movies);
             this.dataSource.paginator = this.paginator;
            })
        }
        else {

          this.service.getMovies();
          this.movieList = this.service.getMovieUpdateListener()
          .subscribe((movies: movie[]) =>{
            this.movies = movies;
            this.insertMoviesForDisplay();

           this.dataSource = new MatTableDataSource<movie>(this.movies);
           this.dataSource.paginator= this.paginator;
          })
        }
    }
  }

  myEval(items){
    return eval(items);
  }

  determineServiceInstruction(data : any){
    if(data.get('genreName') != null){
      this.service.getMoviesinGenre(data.get("genreName"));
      this.movieList = this.service.getMovieUpdateListener()
              .subscribe((movies : movie[]) => {
                this.movies = movies;
                this.insertMoviesForDisplay();

                this.dataSource = new MatTableDataSource<movie>(this.movies);
                this.dataSource.paginator = this.paginator;
              });
      }
    }

    addToShoppingCart(dataTitle : string, dataId : string){
      this.service.addToShoppingCart(dataTitle, dataId);
      this.added = true;
    }

    setItemsPer(data: number){
      if(this.itemsToDisplay < data){
        this.itemsDisplayingFromMovies += (data - this.itemsToDisplay);
      }
      if(this.itemsDisplayingFromMovies > data){
        this.itemsDisplayingFromMovies -= (this.itemsToDisplay - data);
      }
      this.itemsToDisplay = data;
      this.insertMoviesForDisplay();
    }

    private insertMoviesForDisplay(){
      this.moviesForDisplay = [];
      console.log(this.itemsDisplayingFromMovies);
      for(let i = this.itemsDisplayingFromMovies; i < this.itemsToDisplay && i < this.movies.length; ++i){
        this.moviesForDisplay.push(this.movies[i]);
      }
      if(this.itemsDisplayingFromMovies == 0)
        this.itemsDisplayingFromMovies = 10;
    }

    sortByTitle(){
      this.movies.sort((a, b) => (a.title > b.title) ? 1 : -1);
      this.dataSource = new MatTableDataSource<movie>(this.movies);
      this.dataSource.paginator = this.paginator;

    }

    sortByRating(){
      this.movies.sort((a, b) => (a.rating > b.rating) ? 1 : -1);
      this.dataSource = new MatTableDataSource<movie>(this.movies);
      this.dataSource.paginator = this.paginator;

    }

    displayPrevItems(){
      if(this.offset >= 100){
        this.offset -= 100;
      }

    }

    displayNextItems(){
      if(this.itemsDisplayingFromMovies == 100){
        this.offset += 100;
        if(this.inGenre){
          this.service.getMoviesinGenre(this.genreName);

          this.movieList = this.service.getMovieUpdateListener()
          .subscribe((movies : movie[]) => {
            this.movies = movies;
            this.insertMoviesForDisplay();
            this.dataSource = new MatTableDataSource<movie>(this.movies);
            this.dataSource.paginator = this.paginator;

          });
        }
      }
      else {
        this.insertMoviesForDisplay();
        this.itemsDisplayingFromMovies += this.itemsToDisplay;
      }
    }

  ngOnDestroy(){
    if(this.service.isLoggedIn() == "Y")
      this.movieList.unsubscribe();
  }
}
