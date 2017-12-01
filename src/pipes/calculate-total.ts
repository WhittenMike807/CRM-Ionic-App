import { Pipe, PipeTransform } from '@angular/core';
import * as _ from "lodash";

@Pipe({
  name: 'calculateTotal',
  pure: false
})
export class CalculateTotal implements PipeTransform {
  transform(items: number): any{
    let amount = 0;
     _.each(items, function(item){
      amount += item.weightedAmount;
    })

    return amount; 
  }
}
