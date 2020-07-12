import  { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from '../movies-list/movies-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MovieDetailsService } from './movie-details.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit , OnDestroy{

  movieInfo : Subscription;
  movieData : any;

  recentAdd : string;

  added : boolean;

  constructor(private _ActivatedRoute: ActivatedRoute, private service : MovieDetailsService, private mainService : ConfigService, private router: Router) { }

  ngOnInit() {
    if(this.mainService.isLoggedIn() == "N"){
      this.router.navigate(['api/login']);
    } else {
    this.service.getMovie(this._ActivatedRoute.snapshot.paramMap.get("movieName"));
    this.movieInfo = this.service.getMovieInfoUpdateListener()
    .subscribe(movieInfo => {
        this.movieData = movieInfo;
        this.movieData['actors'] = eval(this.movieData['actors']);

    })
    }
  }

  addToShoppingCart(data : string, dataid: string){
    this.mainService.addToShoppingCart(data, dataid);
    this.added = true;
  }

  parseGenreList(items){
    let res = items.split(', ');
    res = res.slice(0, res.length - 1);
    return res;
  }

  ngOnDestroy(){
    if(this.mainService.isLoggedIn() == "Y")
      this.movieInfo.unsubscribe();
  }

}
