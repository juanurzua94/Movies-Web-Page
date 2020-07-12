import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ActorDetailsService } from './actor-details.service';
import { ConfigService } from '../movies-list/movies-list.service';

@Component({
  selector: 'app-actor-details',
  templateUrl: './actor-details.component.html',
  styleUrls: ['./actor-details.component.css']
})
export class ActorDetailsComponent implements OnInit, OnDestroy{

  private actorInfo : Subscription;

  actorData : any;
  constructor(private _ActivatedRoute: ActivatedRoute, private service : ActorDetailsService, private router: Router, private mainService : ConfigService){}

  id : string = "";
  starredInMovies = [];

  ngOnInit(){
      if(this.mainService.isLoggedIn() == "N"){
        this.router.navigate(['api/login']);
      }
      else {
        this.service.getActor((this._ActivatedRoute.snapshot.paramMap.get("actorId")));
        this.actorInfo = this.service.getActorUpdateListener()
        .subscribe(actorData => {
            this.actorData = actorData;
            this.starredInMovies = this.configureMovieData(this.actorData['movies']);
        })
        //console.log(this.service.getActor(this.id));
    }
  }

  private configureMovieData(item : string){
      let temp = item.split(" ::: ");
      temp = temp.slice(0, temp.length - 1)
      return temp;
  }

  ngOnDestroy(){
    if(this.mainService.isLoggedIn() == "Y")
      this.actorInfo.unsubscribe();
  }


}
