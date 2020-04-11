import  { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from '../movies-list/movies-list.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit , OnDestroy{

  movieInfo : Subscription;
  movieData : any;

  constructor(private _ActivatedRoute: ActivatedRoute, private service : ConfigService) { }

  ngOnInit() {
    this.service.getMovie(this._ActivatedRoute.snapshot.paramMap.get("movieName"));
    this.movieInfo = this.service.getMovieInfoUpdateListener()
    .subscribe(movieInfo => {
        this.movieData = movieInfo;
        this.movieData['actors'] = eval(this.movieData['actors']);

    })
  }

  parseGenreList(items){
    let res = items.split(', ');
    res = res.slice(0, res.length - 1);
    return res;
  }

  ngOnDestroy(){
    this.movieInfo.unsubscribe();
  }

}
