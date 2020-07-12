import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DashBoardService {

  //private fullUrl = 'http://ec2-54-153-87-236.us-west-1.compute.amazonaws.com:8080/css122b-spring20api-0.0.1-SNAPSHOT'
  //private fullUrl = 'http://ec2-13-52-241-63.us-west-1.compute.amazonaws.com:8080/css122b-spring20api-0.0.1-SNAPSHOT';
  private fullUrl = 'http://localhost:8090';
  private dashboardUrl = '/api/fablix/_dashboard';
  private addActorUrl = '/addActor';
  private addMovieUrl = '/addMovie';
  private successfullyInsertedMovie = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  getAddedMovieUpdateListener(){
    return this.successfullyInsertedMovie.asObservable();
  }

  addActor(name: string, birthYear: string) : boolean{
    const star = {name: name, birthYear: birthYear};
    this.http.post<object>(
      `${this.fullUrl}${this.dashboardUrl}${this.addActorUrl}`, star
    ).subscribe(responseData => {
        if(responseData["RESULT"] == "ERROR"){
          return false;
        }
    })
    return true;
  }

  addMovie(title: string, director: string, year: string, actor_name: string, genre: string){
    const movie = {title: title, director: director, year: year, actor_name: actor_name, genre: genre};
    console.log(movie);
    this.http.post<object>(
      `${this.fullUrl}${this.dashboardUrl}${this.addMovieUrl}`, movie
    ).subscribe(responseData => {
        if(responseData["SUCCESS"] == "FALSE")
          this.successfullyInsertedMovie.next(false);
        else
          this.successfullyInsertedMovie.next(true);
    })
  }

}
