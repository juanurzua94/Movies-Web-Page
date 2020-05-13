import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../movies-list/movies-list.service';
import { NgForm, Form } from '@angular/forms';

@Component({
  selector: 'app-employee-login',
  templateUrl: 'employee-login.component.html'
})
export class EmployeeLoginComponent {

  incorrect : boolean;

  constructor(private service: ConfigService){ this.incorrect = false ;}

  onLogIn(form : NgForm){
      this.service.employeeLogin(form.value.email, form.value.password);
      if(this.service.employeeLoginError()){
        this.incorrect = true;
      }
  }
}
