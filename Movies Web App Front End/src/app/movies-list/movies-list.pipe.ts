import { Pipe, PipeTransform, } from '@angular/core';
import { Actor } from './actor.model';

@Pipe({name: 'convertMyList'})
export class ConvertMyList implements PipeTransform {



  transform(items: string) : String[]{


      let itemConfig = eval(items);

      let res = [];
      for(let obj of itemConfig){
        res.push(obj['name']);
      }

      return res;

  }

}
