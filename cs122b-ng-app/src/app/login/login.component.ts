import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { NgForm } from '@angular/forms';
import {ConfigService} from '../movies-list/movies-list.service';
import { ImplicitReceiver } from '@angular/compiler';
import {Router} from "@angular/router"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  public incorrect : boolean;

  constructor(private service : ConfigService, private router: Router){
    this.incorrect = false;
    if(this.service.isLoggedIn() == "Y"){
      this.service.logout();
    }
  }

  onLogIn(form: NgForm){
    console.log(form.value);
    this.service.login(form.value.email, form.value.password);
    if(!this.service.getWorked()){
      form.resetForm();
      this.incorrect = true;
    }

  }

}
