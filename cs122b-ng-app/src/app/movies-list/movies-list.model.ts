import {Actor} from './actor.model';
export interface movie {
  id: String;
  director: String;
  title: String;
  year: String;
  rating: String;
  actors: Array<Actor>
  genres: String;
}
