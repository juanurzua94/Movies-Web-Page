import { Injectable } from "@angular/core";
import { Router, UrlSerializer } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {

   //private fullUrl = 'http://ec2-54-153-87-236.us-west-1.compute.amazonaws.com:8080/css122b-spring20api-0.0.1-SNAPSHOT'
  //private fullUrl = 'http://ec2-13-52-241-63.us-west-1.compute.amazonaws.com:8080/css122b-spring20api-0.0.1-SNAPSHOT';
  private fullUrl = 'http://localhost:8090'
  private suggestedMovies : object[] = [];
  private suggestedMoviesListener = new Subject<Object[]>();
  private genresInfoUpdated = new Subject<Object[]>();
  private genres : object[] = [];
  private apiUrl = '/api/movies';
  private genresUrl = '/genres';

  constructor(private http: HttpClient, private router: Router, private serializer: UrlSerializer) {}

  getSuggestedMoviesUpdateListener(){
    return this.suggestedMoviesListener.asObservable();
  }

  getGenresinfoUpdateListener(){
    return this.genresInfoUpdated.asObservable();
  }


    getSuggestedResults(data : any){
      const queryUrl = this.router.createUrlTree(['api/movies/suggestedsearch'], {queryParams : data});
      let queryString = this.serializer.serialize(queryUrl);
      const fullUrl = `${this.fullUrl}${queryString}`;
      console.log(fullUrl)

      this.http.get<object[]>(fullUrl)
      .subscribe(movieNames => {
          this.suggestedMovies = movieNames;
          this.suggestedMoviesListener.next([...this.suggestedMovies])
      })
  }

  getGenres(){
    const fullUrl = `${this.fullUrl}${this.apiUrl}${this.genresUrl}`;
    this.http.get<object[]>(fullUrl)
    .subscribe(genresData => {

      this.genres = genresData;
      this.genresInfoUpdated.next([...this.genres]);
    });
  }

}
