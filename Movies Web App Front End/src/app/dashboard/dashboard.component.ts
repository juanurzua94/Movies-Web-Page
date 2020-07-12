import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../movies-list/movies-list.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subscription, } from 'rxjs';
import { DashBoardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html'
})
export class DashBoardComponent implements OnInit {

  successfullyAddedActor : boolean;
  unsuccessfullyAddedActor : boolean;

  successfullyAddedMovieSubs : Subscription;

  successfullyAddedMovie : string




  constructor(private service : DashBoardService, private mainService : ConfigService, private router : Router){
    this.successfullyAddedActor = false;
    this.unsuccessfullyAddedActor = false;

  }

  ngOnInit(){
    if(!this.mainService.isEmployeeLoggedIn()){
      this.router.navigate(['api/fablix/_dashboard/login']);
    }
  }

  addActor(form : NgForm){
    if(this.successfullyAddedActor)
      this.successfullyAddedActor = false;
    if(this.unsuccessfullyAddedActor)
      this.unsuccessfullyAddedActor = false;
    this.successfullyAddedActor = this.service.addActor(form.value.name, form.value.birthyear);
    if(!this.successfullyAddedActor)
      this.unsuccessfullyAddedActor = false;
  }

  addMovie(form : NgForm){
    if(this.successfullyAddedActor)
      this.successfullyAddedActor = false;
    if(this.unsuccessfullyAddedActor)
      this.unsuccessfullyAddedActor = false;
    this.service.addMovie(form.value.title, form.value.director, form.value.year, form.value.star_name, form.value.genre);
    this.successfullyAddedMovieSubs = this.service.getAddedMovieUpdateListener().subscribe(
      ((result : boolean) =>{
        if(result)
          this.successfullyAddedMovie = "WORKED";
        else
          this.successfullyAddedMovie = "INCORRECT";
      })
    )

    }

}
