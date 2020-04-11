import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MoviesListComponent } from './movies-list/movies-list.component';
import { ActorDetailsComponent } from './actors/actor-details.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';


const routes: Routes = [
  {path: 'api/movies', component: MoviesListComponent},
  {path: 'api/movies/actor/:actorId', component: ActorDetailsComponent},
  {path: 'api/movies/movie/:movieName', component: MovieDetailsComponent},
  {path: '', redirectTo: 'api/movies', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
