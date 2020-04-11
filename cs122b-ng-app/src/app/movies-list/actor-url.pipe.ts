import { Pipe, PipeTransform, } from '@angular/core';
import { Actor } from './actor.model';

@Pipe({name: 'actorUrlPipe'})
export class ActorUrlPipe implements PipeTransform {



  transform(items: string, position : number) : string{
      let temp = eval(items);

      return temp[position]['id'];
  }

}
