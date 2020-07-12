import { Pipe, PipeTransform, } from '@angular/core';
import { Actor } from './actor.model';

@Pipe({name: 'convertMyGenreList'})
export class ConvertMyGenreList implements PipeTransform {



  transform(items: string) : String[]{


      let res = items.split(', ');
      res = res.slice(0, res.length - 1);
      return res;

  }

}
