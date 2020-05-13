import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MoviesListComponent } from './movies-list/movies-list.component';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ConvertMyList } from './movies-list/movies-list.pipe';
import {MatMenuModule} from '@angular/material/menu';
import {ConvertMyGenreList} from './movies-list/genre-list.pipe';
import {ActorDetailsComponent} from './actors/actor-details.component';
import {ActorUrlPipe} from './movies-list/actor-url.pipe'
import {MatGridListModule} from '@angular/material/grid-list';
import {NavBarComponent} from './nav/nav-bar.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import {MatTabsModule} from '@angular/material/tabs';
import { LoginComponent } from './login/login.component';

import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule }   from '@angular/forms';
import { MainComponent } from './main/main.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { ShoppingCartComponent} from './shopping-cart/shopping-cart.component';
import {PayComponent} from './pay/pay.component';

import { DashBoardComponent } from './dashboard/dashboard.component';
import {EmployeeLoginComponent} from './dashboard/employee-login.component'
@NgModule({
  declarations: [
    AppComponent,
    MoviesListComponent,
    ConvertMyList,
    ConvertMyGenreList,
    ActorDetailsComponent,
    ActorUrlPipe,
    NavBarComponent,
    MovieDetailsComponent,
    LoginComponent,
    MainComponent,
    ShoppingCartComponent,
    PayComponent,
    DashBoardComponent,
    EmployeeLoginComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    CommonModule,
    MatMenuModule,
    MatGridListModule,
    MatTabsModule,
    MatFormFieldModule,
    FormsModule,
    MatExpansionModule
  ],
  providers: [ConvertMyList, ConvertMyGenreList, ActorUrlPipe],
  bootstrap: [AppComponent]
})
export class AppModule {
  private loggedIn : boolean;

  constructor(){
    this.loggedIn = false;
  }

  userLoggedIn(){
    this.loggedIn = true;
  }

  userLoggedOut(){
    this.loggedIn = false;
  }
}
