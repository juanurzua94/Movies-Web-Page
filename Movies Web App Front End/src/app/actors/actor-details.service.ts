import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActorDetails } from '../actors/actor-details.model';

@Injectable({
    providedIn: 'root'
})
export class ActorDetailsService {

  private actorInfoUpdated = new Subject<Object>();

  //private fullUrl = 'http://ec2-54-153-87-236.us-west-1.compute.amazonaws.com:8080/css122b-spring20api-0.0.1-SNAPSHOT'
  //private fullUrl = 'http://ec2-13-52-241-63.us-west-1.compute.amazonaws.com:8080/css122b-spring20api-0.0.1-SNAPSHOT';
  private fullUrl = 'http://localhost:8090'
  private apiUrl = '/api/movies';
  private actorUrl = '/actor/';

  private actorInfo;

  constructor(private http: HttpClient) {}

  getActorUpdateListener(){
    return this.actorInfoUpdated.asObservable();
  }

  getActor(actorId : string){
    let fullUrl = `${this.fullUrl}${this.apiUrl}${this.actorUrl}${actorId}`;
    this.http.get<ActorDetails>(fullUrl)
    .subscribe(actorData => {
      this.actorInfo = actorData;
      this.actorInfoUpdated.next(this.actorInfo);
    })

  }

}
