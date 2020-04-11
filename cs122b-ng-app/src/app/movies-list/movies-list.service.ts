import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { movie } from './movies-list.model';
import { Actor } from './actor.model';
import { ActorDetailsComponent } from '../actors/actor-details.component';
import { ActorDetails } from '../actors/actor-details.model';
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private apiUrl = '/api/movies';
  private fullUrl = 'http://localhost:8090';
  private actorUrl = '/actor/';
  private movieUrl = '/movie/';
  private moviesUpdated = new Subject<movie[]>();
  private actorInfoUpdated = new Subject<Object>();
  private movieInfoUpdated = new Subject<Object>();
  private movies : movie[] = [];
  private actors: Actor[] = [];
  private actorInfo;
  private movieInfo;
  constructor(private http: HttpClient) { }

  getMovies() {
    this.http.get<movie[]>(this.fullUrl + this.apiUrl)
    .subscribe(movieData => {
      this.movies = movieData;
      this.moviesUpdated.next([...this.movies]);
     // this.updateActorsList();
    })
  }

  getMovieUpdateListener(){
      return this.moviesUpdated.asObservable();
  }

  getActorUpdateListener(){
    return this.actorInfoUpdated.asObservable();
  }

  getMovieInfoUpdateListener(){
    return this.movieInfoUpdated.asObservable();
  }

  getActor(actorId : string){
      let fullUrl = `${this.fullUrl}${this.apiUrl}${this.actorUrl}${actorId}`;
      this.http.get<ActorDetails>(fullUrl)
      .subscribe(actorData => {
        this.actorInfo = actorData;
        this.actorInfoUpdated.next(this.actorInfo);
      })

  }

  getMovie(movieName: string){
    let fullUrl = `${this.fullUrl}${this.apiUrl}${this.movieUrl}${this.encodeMovie(movieName)}`;
    this.http.get<object>(fullUrl)
    .subscribe(movieData => {
        this.movieInfo = movieData;
        this.movieInfoUpdated.next(this.movieInfo);
    });
  }

  private encodeMovie(movieName : string){
    let temp = movieName.split(" ");
    let temp2 = temp.join("%20");
    return temp2;
  }

}
