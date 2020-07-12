import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class MovieDetailsService{


  private movieInfo;

  private movieInfoUpdated = new Subject<Object>();

   //private fullUrl = 'http://ec2-54-153-87-236.us-west-1.compute.amazonaws.com:8080/css122b-spring20api-0.0.1-SNAPSHOT'
  //private fullUrl = 'http://ec2-13-52-241-63.us-west-1.compute.amazonaws.com:8080/css122b-spring20api-0.0.1-SNAPSHOT';
  private fullUrl = 'http://localhost:8090'
  private movieUrl = '/movie/';
  private apiUrl = '/api/movies';

  constructor(private http: HttpClient) {}

  getMovieInfoUpdateListener(){
    return this.movieInfoUpdated.asObservable();
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
