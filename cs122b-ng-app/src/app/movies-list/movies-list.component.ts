import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {ConfigService} from './movies-list.service';
import { Subscription } from 'rxjs';
import {movie} from './movies-list.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {Actor} from './actor.model';

@Component({
  selector : 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.css']
})
export class MoviesListComponent implements OnInit, OnDestroy{
  data = null;
  private movieList : Subscription;
  movies : movie[] = [];
  actors : Actor[] = [];
  displayedColumns = ['title', 'year', 'director', 'rating', 'actors', 'genres'];
  dataSource = new MatTableDataSource<movie>(this.movies);
  @ViewChild(MatPaginator, {static : true}) paginator;
  constructor(public service: ConfigService){}

  /*
  getActorData($event){
    alert($event['toElement']['innerText']);
  }

  getGenreMovies($event){
    alert($event['toElement']['innerText']);
  }*/

  ngOnInit(){
      this.service.getMovies();
      this.movieList = this.service.getMovieUpdateListener()
      .subscribe((movies : movie[]) => {

        this.movies = movies;
        this.dataSource = new MatTableDataSource<movie>(this.movies);
        this.dataSource.paginator = this.paginator;

      })
  }

  myEval(items){
    return eval(items);
  }


  ngOnDestroy(){
    this.movieList.unsubscribe();
  }
}
