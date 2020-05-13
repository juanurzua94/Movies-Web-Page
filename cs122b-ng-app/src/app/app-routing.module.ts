import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MoviesListComponent } from './movies-list/movies-list.component';
import { ActorDetailsComponent } from './actors/actor-details.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { PayComponent } from './pay/pay.component';
import { DashBoardComponent } from './dashboard/dashboard.component';
import { EmployeeLoginComponent } from './dashboard/employee-login.component';


const routes: Routes = [
  {path: 'api/movies', component: MoviesListComponent},
  {path: 'api/movies/search', component: MoviesListComponent},
  {path: 'api/movies/genre/:genreName', component: MoviesListComponent},
  {path: 'api/movies/title/:letter', component: MoviesListComponent},
  {path: 'api/movies/actor/:actorId', component: ActorDetailsComponent},
  {path: 'api/movies/movie/:movieName', component: MovieDetailsComponent},
  {path: 'api/login', component: LoginComponent},
  {path: 'api/logout', component: LoginComponent},
  {path: 'api/home', component: MainComponent},
  {path: 'api/shoppingcart', component: ShoppingCartComponent},
  {path: 'api/pay', component: PayComponent},
  {path: 'api/fablix/_dashboard', component: DashBoardComponent},
  {path: 'api/fablix/_dashboard/login', component: EmployeeLoginComponent},
  {path: '', redirectTo: 'api/movies', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
