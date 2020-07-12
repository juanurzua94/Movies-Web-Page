import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../movies-list/movies-list.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html'
})
export class PayComponent implements OnInit{

  constructor(private service : ConfigService, private router : Router){}

  error = false;

  ngOnInit(){

    if(this.service.isLoggedIn() == "N"){
        this.router.navigate(['api/login']);
    }

  }

  pay(form: NgForm){


    this.service.submitPayment(form.value);
    if(this.service.errorWithPayment()){
      this.error = true;
    }
  }
}
